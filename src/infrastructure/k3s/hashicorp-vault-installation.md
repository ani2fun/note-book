# 📚 **✅ Hashicorp Vault Installation with TLS Termination at Ingress**

---

## 🚩 **Overview**

You’ll learn how to:

1️⃣ Install **cert-manager** and create a ClusterIssuer (skip if you already have it for ArgoCD).
2️⃣ Create a DNS A record for `vault.kakde.eu` → points to your NGINX ingress controller.
3️⃣ Install Vault using the official Helm chart with **HTTP only** internally → **Ingress** terminates TLS using **Let’s Encrypt**.
4️⃣ Initialize Vault, unseal it, log in with the Root Token.
5️⃣ Rotate the Root Token for security.
6️⃣ Troubleshoot common gotchas step by step.

---

## 📦 **Prerequisites**

✅ **K3s cluster running**

✅ **NGINX ingress controller installed and working**

✅ **cert-manager installed and a working `ClusterIssuer` for Let’s Encrypt**

✅ **A DNS record `vault.kakde.eu` pointing to your ingress controller’s IP**

✅ **Helm installed**

---

## ✅ **1️⃣ Create the namespace**

```bash
kubectl create namespace vault
```

---

## ✅ **2️⃣ Create the Let’s Encrypt certificate**

This makes cert-manager issue a TLS cert for your domain:

**vault-certificate.yaml**

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: vault-cert
  namespace: vault
spec:
  secretName: vault-tls
  issuerRef:
    name: letsencrypt-prod-http01   # must match your ClusterIssuer
    kind: ClusterIssuer
  commonName: vault.kakde.eu
  dnsNames:
    - vault.kakde.eu
```

Apply:

```bash
kubectl apply -f vault-certificate.yaml
```

Confirm:

```bash
kubectl get certificate -n vault
kubectl describe certificate vault-cert -n vault
kubectl get secret vault-tls -n vault
```

---

## ✅ **3️⃣ Write your final `vault-values.yaml`**

```yaml
global:
  tlsDisable: true   # ← Vault runs HTTP only

server:
  extraConfig: |
    listener "tcp" {
      address     = "0.0.0.0:8200"
      tls_disable = 1
    }

    storage "file" {
      path = "/vault/data"
    }

    ui = true
    disable_mlock = true

  ha:
    enabled: false
  standalone:
    enabled: true

  dataDir: /vault/data
  logLevel: trace

  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 200m
      memory: 256Mi

  storageClass: local-path

  nodeSelector:
    kubernetes.io/hostname: worker-01.kakde.eu

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod-http01
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
  tls:
    - hosts:
        - vault.kakde.eu
      secretName: vault-tls
  rules:
    - host: vault.kakde.eu
      http:
        paths:
          - path: "/"
            pathType: Prefix
            backend:
              service:
                name: vault
                port:
                  number: 8200

injector:
  enabled: true

ui:
  enabled: true
```

✅ **Key concept:**

* `tlsDisable: true` → Vault only listens on HTTP.
* Ingress handles HTTPS with Let’s Encrypt cert.

---

## ✅ **4️⃣ Install Vault**

Add Helm repo (only once):

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

Then install:

```bash
helm install vault hashicorp/vault \
  --namespace vault \
  --values vault-values.yaml
```

Check status:

```bash
kubectl get pods -n vault
```

---

## ✅ **5️⃣ If Ingress didn’t appear, apply it manually**

Sometimes Helm fails to render the Ingress.
Create it manually if needed:

**vault-ingress.yaml**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vault-ingress
  namespace: vault
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod-http01
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTP"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - vault.kakde.eu
      secretName: vault-tls
  rules:
    - host: vault.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: vault
                port:
                  number: 8200
```

Apply:

```bash
kubectl apply -f vault-ingress.yaml
```

---

## ✅ **6️⃣ Initialize Vault**

Vault pods start **sealed** — they must be **initialized** once.

```bash
kubectl exec -it vault-0 -n vault -- vault operator init --tls-skip-verify
```

This prints:

* **5 unseal keys**
* **1 Initial Root Token**

✅ **Store these securely** (e.g. 1Password, HashiCorp Vault itself, or your secure password vault).

---

## ✅ **7️⃣ Unseal Vault**

Vault needs **3 of 5 keys** to unseal.

Run three times:

```bash
kubectl exec -it vault-0 -n vault -- vault operator unseal --tls-skip-verify
```

Paste Key 1 → repeat with Key 2 → repeat with Key 3.

---

## ✅ **8️⃣ Confirm status**

```bash
kubectl exec -it vault-0 -n vault -- vault status --tls-skip-verify
```

Should say:

```
Sealed: false
```

✅ Pod becomes **1/1 Running**

---

## ✅ **9️⃣ Open the UI**

Open:

```
https://vault.kakde.eu
```

✔️ Log in with **Initial Root Token**:

```
hvs.XXXXXXXXXXXXXXXXX
```

---

## ✅ **10️⃣ 🔐 Rotate the Root Token**

**The Initial Root Token is like an admin master key — rotate it!**

Log in:

```bash
vault login <initial_root_token>
```

**Create a new Root Token:**

```bash
vault token create -policy=root
```

It will output a **new root token** — store this securely.

**Then revoke the old one**:

```bash
vault token revoke <initial_root_token>
```

This ensures only your new root token works.

---

## ✅ **11️⃣ Common troubleshooting**

**Q: Pods stuck `0/1`?**
➡️ Vault is sealed → `vault operator unseal`.

---

**Q: Ingress not working?**
✅ Check:

```bash
kubectl get ingress -n vault
kubectl describe ingress vault-ingress -n vault
kubectl describe certificate vault-cert -n vault
kubectl describe challenge -A
kubectl get secret vault-tls -n vault
```

* If the `vault-tls` secret does not exist → Let’s Encrypt failed → check `kubectl describe challenge`.

---

**Q: Browser says “connection refused”?**
✅ Confirm DNS → your domain `vault.kakde.eu` must resolve to your ingress controller IP.

---

**Q: Pod crashes?**
✅ Check logs:

```bash
kubectl logs vault-0 -n vault
```

---

**Q: Handling Vault CLI TLS Error**

```
WARNING! VAULT_ADDR and -address unset. Defaulting to https://127.0.0.1:8200.
Error authenticating: error looking up token: Get "https://127.0.0.1:8200/v1/auth/token/lookup-self": tls: failed to verify certificate: x509: cannot validate certificate for 127.0.0.1 because it doesn't contain any IP SANs
```

### Why?

* `vault login` defaults to `https://127.0.0.1:8200`
* Your Vault pod (in K8s) runs with TLS disabled (HTTP only)
* Your local Vault CLI is trying HTTPS on localhost with no valid cert for 127.0.0.1

### How to fix:

**Option A (Recommended): Use Vault CLI via Ingress TLS**

```bash
export VAULT_ADDR="https://vault.kakde.eu"
vault login <your-root-token>
```

**Option B: Exec inside pod and use HTTP**

```bash
kubectl exec -it vault-0 -n vault -- sh
export VAULT_ADDR="http://127.0.0.1:8200"
vault login <your-root-token>
```

**Option C: Configure your local Vault service (if running separately) to use valid certs with SANs including 127.0.0.1, or disable TLS for dev.**

---

## ✅ **12️⃣ Best practice**

* Save **unseal keys** securely → share them with multiple trusted people.
* For production → use **Auto Unseal** with AWS KMS, GCP KMS, or Azure Key Vault.
* Do not use the root token for day-to-day — create admin policies instead.

---

## 🎉 **Complete!**

You now have:
✅ Secure HTTPS Vault with Ingress TLS termination
✅ Let’s Encrypt auto-certs
✅ Clean Helm-managed config
✅ Root Token rotated
✅ Ready for production

---

## 📚 **Useful next steps**

* Setup audit logging:

  ```bash
  vault audit enable file file_path=/vault/logs/audit.log
  ```

* Create an admin policy:

  ```hcl
  path "*" {
    capabilities = ["create", "read", "update", "delete", "list", "sudo"]
  }
  ```

* Enable a secrets engine:

  ```bash
  vault secrets enable kv
  vault kv put kv/hello foo=bar
  ```

---

## 📚 **HashiCorp Vault — Root key Recovery & TLS Troubleshooting Guide (AlmaLinux + K3s)**

---

## ✅ **Overview**

This tutorial explains **how to recover access** to a **HashiCorp Vault** instance on AlmaLinux or inside a **K3s** cluster **when your only root token is lost or revoked**.
It covers:

* Verifying installation
* Fixing `vault: command not found`
* Solving **TLS certificate SAN errors**
* Using **unseal keys** or **recovery keys**
* Regenerating a **root token**
* **Reinitializing** Vault if all else fails
* Best practices to **prevent lockouts**

---

## 📌 **Who is this for?**

* OS: **AlmaLinux** or **RHEL-based distros**
* Environment: Local VM or **Kubernetes cluster** (K3s)
* Audience: Admins & engineers who need to **unseal, recover, or reinit** Vault safely.

---

## ⚙️ **Prerequisites**

✅ Vault **installed & running**
✅ You have at least the **unseal keys** or **recovery keys**
✅ **Root** or `sudo` access
✅ DNS and Ingress working if using Vault behind **Ingress NGINX + cert-manager**

---

## ---------------------------

## **Step 1 — Verify Vault is Installed**

### 🗂️ 1.1 Check installation

```bash
which vault
```

✅ Expected: `/usr/bin/vault`

---

### 🗂️ 1.2 If missing: Install Vault

```bash
sudo tee /etc/yum.repos.d/hashicorp.repo <<EOF
[hashicorp]
name=HashiCorp Stable
baseurl=https://rpm.releases.hashicorp.com/RHEL/\$releasever/\$basearch/stable
enabled=1
gpgcheck=1
gpgkey=https://rpm.releases.hashicorp.com/gpg
EOF

sudo dnf update -y
sudo dnf install -y vault
```

---

### 🗂️ 1.3 Verify version

```bash
vault --version
# Expected: Vault v1.x.x
```

---

### 🗂️ 1.4 Fix PATH if `vault` not found

```bash
echo $PATH
# Should include /usr/bin

export PATH=$PATH:/usr/bin
echo 'export PATH=$PATH:/usr/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## ---------------------------

## **Step 2 — Fix TLS Certificate SAN Errors**

### 🔐 **Common error**

```
Error authenticating: tls: failed to verify certificate: x509: cannot validate certificate for 127.0.0.1 because it doesn't contain any IP SANs
```

---

### 🗂️ 2.1 Always use the correct `VAULT_ADDR`

**Never default to `127.0.0.1` if your server cert does not have `IP:127.0.0.1` SAN.**
Use your **Ingress DNS name** or valid host:

```bash
export VAULT_ADDR=https://vault.kakde.eu
echo 'export VAULT_ADDR=https://vault.kakde.eu' >> ~/.bashrc
source ~/.bashrc
```

✅ Verify:

```bash
vault status
```

---

### 🗂️ 2.2 Check your Vault TLS config (for direct server mode)

```bash
cat /etc/vault.d/vault.hcl
```

Example:

```hcl
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault.d/vault.crt"
  tls_key_file  = "/etc/vault.d/vault.key"
}
```

---

### 🗂️ 2.3 Inspect SANs

```bash
openssl x509 -in /etc/vault.d/vault.crt -text -noout | grep -A1 "Subject Alternative Name"
```

✅ Should include:

```
DNS:vault.kakde.eu, IP:127.0.0.1
```

---

### 🗂️ 2.4 Regenerate self-signed cert with proper SANs (if needed)

```bash
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
  -keyout vault.key -out vault.crt \
  -subj "/CN=vault.kakde.eu" \
  -addext "subjectAltName=DNS:vault.kakde.eu,IP:127.0.0.1"

sudo mv vault.crt /etc/vault.d/vault.crt
sudo mv vault.key /etc/vault.d/vault.key
sudo chown vault:vault /etc/vault.d/vault.{crt,key}
sudo chmod 600 /etc/vault.d/vault.{crt,key}

sudo systemctl restart vault
```

---

### 🗂️ 2.5 Trust your cert locally (if self-signed)

```bash
sudo cp /etc/vault.d/vault.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

✅ For dev:

```bash
export VAULT_SKIP_VERIFY=true
```

---

## ---------------------------

## **Step 3 — Check Vault Status**

```bash
vault status
```

* `Sealed: true` → **unseal required**
* `Sealed: false` → you can authenticate

---

## ---------------------------

## **Step 4 — Unseal Vault**

```bash
vault operator unseal <unseal-key-1>
vault operator unseal <unseal-key-2>
vault operator unseal <unseal-key-3>
```

✅ Threshold: Usually **3 of 5** keys.

---

## ---------------------------

## **Step 5 — If Root Token is Revoked**

If you accidentally revoked **your only root token**, you **must generate a new one** using **recovery keys** or **operator generate-root** flow.

---

### 🗂️ 5.1 Start generate-root

```bash
vault operator generate-root -init
```

✅ Note:

* The `OTP`
* The `nonce`

---

### 🗂️ 5.2 Provide recovery keys to complete

```bash
vault operator generate-root -nonce=<nonce> <recovery-key-1>
vault operator generate-root -nonce=<nonce> <recovery-key-2>
vault operator generate-root -nonce=<nonce> <recovery-key-3>
```

---

### 🗂️ 5.3 Decode the new token

```bash
vault operator generate-root -decode=<encoded-token> -otp=<otp>
```

✅ Output: **new usable root token**

---

### 🗂️ 5.4 Log in

```bash
vault login <new-root-token>
```

✅ Check:

```bash
vault token lookup
```

Should show `policies: ["root"]`

---

## ---------------------------

## **Step 6 — SELinux Caveat**

If you run Vault as a service:

```bash
getenforce
```

✅ `Enforcing` can block file access. For debugging:

```bash
sudo setenforce 0
```

**Better:** Define proper SELinux policies for `/etc/vault.d`.

---

## ---------------------------

## **Step 7 — Last Resort: Reinitialize**

If you lost **all unseal keys** or recovery keys:

```bash
sudo systemctl stop vault
sudo rm -rf /path/to/vault/data/*
sudo systemctl start vault
vault operator init
```

✅ Save your **new unseal keys** and **root token** safely.

---

## ---------------------------

## ✅✅✅ **Best Practices**

✅ Always keep **unseal keys** & **root tokens** secure — password vault, encrypted backup.

✅ Avoid daily work with root — create **admin policies** instead.

✅ Enable **multi-factor auth** for human logins.

✅ Enable **audit logs**:

```bash
vault audit enable file file_path=/var/log/vault_audit.log
```

✅ Use trusted **certs** and Ingress with **proper SANs** to avoid TLS issues.

✅ For Kubernetes: Use **Auto Unseal** with cloud KMS for production.

---

## ⚡️ **Troubleshooting Quick Reference**

| Problem                    | Solution                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| `vault: command not found` | Fix PATH or install Vault                                              |
| TLS SAN error              | Use `VAULT_ADDR` with correct hostname, regenerate cert                |
| Permission denied on login | You’re using an invalid token. Use a valid root token or recovery key. |
| Sealed Vault               | Unseal with threshold number of keys                                   |
| Lost all keys              | Reinitialize (wipe storage!)                                           |
| `vault status` unreachable | Check Ingress, DNS, firewall, SELinux                                  |

---
