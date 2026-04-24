# Edge-only Traefik → whoami → Let’s Encrypt with cert-manager (Cloudflare DNS-01)

> Current note
> This is a detailed historical deep dive. For the current platform setup, start with [01-platform-overview.md](01-platform-overview.md) and [06-platform-services-step-by-step.md](06-platform-services-step-by-step.md).

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#3-architecture-the-pieces-involved)
3. [Design decisions](#4-why-certain-decisions-were-made)
4. [Phase 4 workflow (end-to-end)](#5-phase-4-workflow-end-to-end)
5. [Validation checklist](#6-validation-checklist-good-looks-like)
6. [Troubleshooting](#7-troubleshooting-and-quick-fixes)
7. [Glossary](#9-glossary-simple-definitions)
8. [Learning links](#11-learning-links-official--high-quality)

---

## 1. Overview

This document explains how the environment reached a stable **edge-only ingress** setup using **Traefik** on the public server (`ctb-edge-1`), how a test app (`whoami`) was published under `whoami.kakde.eu`, and how **production-grade TLS certificates** were issued using **cert-manager** and **Cloudflare DNS-01**.

Each step includes:

* **Where to run commands** (which machine)
* **What the commands do**
* **How to verify success**
* **Common failure modes and fixes**

---

## 2. What we built (high-level)

By the end of Phase 4:

* Traefik is deployed **only** on the public edge node `ctb-edge-1`.
* Traefik listens on **host ports 80 and 443** (`*:80` and `*:443`).
* HTTP requests redirect to HTTPS (308 redirect).
* A demo service `whoami` is deployed inside Kubernetes:

    * Exposed through Traefik with an Ingress for `whoami.kakde.eu`.
* TLS is handled by **cert-manager** using **Let’s Encrypt** certificates.
* Let’s Encrypt challenges are solved using **Cloudflare DNS-01** via a `ClusterIssuer`.

---

## 3. Architecture (the pieces involved)

### Machines involved

* **ctb-edge-1** (public / Contabo)

    * Public IP: `198.51.100.25`
    * WireGuard internal IP: `172.27.15.31`
    * Runs Traefik and binds host ports 80/443
* **ms-1** (home LAN, K3s server)

    * Runs the Kubernetes control-plane (K3s server)
    * Used for `kubectl` management
* (Optional) your laptop / any external machine for real internet tests

### Kubernetes components

* **Traefik**: Ingress Controller (routes HTTP/HTTPS to services)
* **whoami**: a tiny HTTP server used for testing routing and TLS
* **cert-manager**: Kubernetes certificate controller
* **Let’s Encrypt**: certificate authority issuing real TLS certs
* **Cloudflare**: DNS provider used for DNS-01 challenges

---

## 4. Why certain decisions were made

### Why “edge-only” Traefik?

Security and simplicity:

* Only one machine is exposed to the internet.
* Home LAN nodes remain private and can be firewalled tightly.
* All inbound HTTP/HTTPS traffic terminates at the edge and then routes to Kubernetes.

### Why we moved to cert-manager (Cloudflare DNS-01) instead of Traefik ACME?

Both work, but cert-manager is often preferred because:

* It standardizes TLS across the cluster (works with any Ingress Controller).
* DNS-01 avoids problems with HTTP challenge routing, NAT, or port ownership.
* It stores certs as Kubernetes Secrets (clean, auditable, GitOps-friendly).
* It avoids Traefik ACME file permission issues (the document observed “permission denied” on `/data/acme-*.json` when using Traefik ACME).

---

## 5. Phase 4 workflow (end-to-end)

### Prerequisites

* You have working `kubectl` access (commonly from **ms-1**):

  ```bash
  export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
  ```
* Traefik is already deployed edge-only and stable.

---

### 5.1 Verify Traefik on the edge

**Where:** `ctb-edge-1`

#### Check Traefik is listening on host ports 80/443

```bash
ss -lntp | egrep ':(80|443)\b' || true
```

**Expected result:**

* Something like Traefik listening on `*:80` and `*:443`.

#### Confirm HTTP redirects to HTTPS

```bash
curl -I http://127.0.0.1/
```

**Expected result:**

* `HTTP/1.1 308 Permanent Redirect` with a `Location: https://...`

---

### 5.2 Fix Traefik rollout deadlock (what happened + how it was resolved)

**Problem observed in the project:**
Traefik rollout got stuck because a rolling update tried to create a “surge” pod that could not schedule (host ports 80/443 are exclusive). With hostPort-based ingress, **surge pods can deadlock**.

**Fix that worked:**

* Set Deployment strategy to:

    * `maxSurge=0` (so no additional pod is created), **or**
    * `Recreate` (kill old pod then start new)
* Delete the pending surge pod.
* Remove admin port 9000 hostPort exposure.
* Change readiness/liveness probes to TCP socket on port 80.
* Rollout completed; Traefik stayed stable.

**Where:** `ms-1` (kubectl machine)

#### Verify Traefik rollout status

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl -n traefik rollout status deploy/traefik
kubectl -n traefik get pods -o wide
```

**If rollout is stuck** (example workflow):

```bash
kubectl -n traefik get pods -o wide
# Identify the pending/un-schedulable "surge" pod, then delete it:
kubectl -n traefik delete pod <PENDING_POD_NAME>
```

**How to apply the strategy change** (one-time edit):

```bash
kubectl -n traefik edit deploy/traefik
```

**What to change inside the editor (conceptually):**

* Set rolling update `maxSurge: 0`
* Or set `strategy.type: Recreate`
* Ensure probes are `tcpSocket` rather than HTTP to admin ports
* Remove hostPort 9000 if it was exposed

**Verification:**

```bash
kubectl -n traefik rollout status deploy/traefik
kubectl -n traefik logs deploy/traefik --tail=50
```

---

### 5.3 Deploy `whoami` (Deployment + Service + Ingress)

This creates a simple HTTP service so you can verify routing and TLS end-to-end.

**Where:** `ms-1`

#### Apply manifests

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: apps
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whoami
  namespace: apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
        - name: whoami
          image: traefik/whoami:latest
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: whoami
  namespace: apps
spec:
  selector:
    app: whoami
  ports:
    - name: http
      port: 80
      targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: whoami
  namespace: apps
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
spec:
  ingressClassName: traefik
  rules:
    - host: whoami.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: whoami
                port:
                  number: 80
EOF
```

#### Verify the app is running

```bash
kubectl -n apps get deploy,po,svc,ingress -o wide
kubectl -n apps rollout status deploy/whoami
```

**Expected result:**

* `whoami` pod is `Running`
* Service exists
* Ingress exists

---

### 5.4 Internal tests on the edge (Host header)

This is critical because it proves Traefik routing works locally before DNS/public testing.

**Where:** `ctb-edge-1`

#### HTTP request with Host header (expected redirect)

```bash
curl -sS -I -H 'Host: whoami.kakde.eu' http://127.0.0.1/
```

**Expected:**

* `308 Permanent Redirect` to HTTPS

#### HTTPS request with Host header (initial failure mode)

```bash
curl -sS -k -I -H 'Host: whoami.kakde.eu' https://127.0.0.1/
```

**Initial failure observed earlier in the project:**

* `404` on HTTPS — meaning Traefik had no TLS router for that host.

---

### 5.4.1 Fix: “Make whoami route on HTTPS (stop the 404)”

The fix used in the project was to explicitly enable TLS routing for the Ingress.

**Where:** `ms-1`

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl -n apps annotate ingress whoami \
  traefik.ingress.kubernetes.io/router.tls="true" \
  --overwrite

kubectl -n apps annotate ingress whoami \
  traefik.ingress.kubernetes.io/router.entrypoints="websecure" \
  --overwrite
```

Now re-test HTTPS on the edge:

**Where:** `ctb-edge-1`

```bash
curl -sS -k -I -H 'Host: whoami.kakde.eu' https://127.0.0.1/
curl -sS -k -H 'Host: whoami.kakde.eu' https://127.0.0.1/ | head
```

**Expected (and achieved in the project):**

* `HTTP/2 200`
* Body shows `Hostname`, request headers, etc.

This confirms:

* Traefik terminates TLS successfully
* Routing works to the Kubernetes service/pod

---

### 5.5 External tests (curl `--resolve`)

This lets you test **public routing** even before DNS is fully propagated.

**Where:** your laptop or any external machine

```bash
# HTTP should redirect
curl -sS -I --resolve whoami.kakde.eu:80:198.51.100.25 http://whoami.kakde.eu/

# HTTPS route (use -k until you have a real cert)
curl -sS -k -I --resolve whoami.kakde.eu:443:198.51.100.25 https://whoami.kakde.eu/
curl -sS -k --resolve whoami.kakde.eu:443:198.51.100.25 https://whoami.kakde.eu/ | head
```

---

## 5.6 TLS: cert-manager + ClusterIssuer + Cloudflare DNS-01 (recommended)

### Cloudflare DNS token verification (what you did)

You verified the token works using:

```bash
curl "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/tokens/verify" \
  -H "Authorization: Bearer <TOKEN>"
```

Success means:

* The token is active
* cert-manager can use it (assuming token permissions include DNS edits)

---

### 5.7 Install cert-manager

**Where:** `ms-1`

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Install Helm if needed (Ubuntu):
sudo apt-get update && sudo apt-get install -y helm

helm repo add jetstack https://charts.jetstack.io
helm repo update

kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --set installCRDs=true
```

**Verify:**

```bash
kubectl -n cert-manager get pods
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector
```

---

### 5.8 Create Cloudflare API token Secret

**Where:** `ms-1`

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

read -s CF_API_TOKEN
echo

kubectl -n cert-manager create secret generic cloudflare-api-token \
  --from-literal=api-token="$CF_API_TOKEN" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n cert-manager get secret cloudflare-api-token
```

---

### 5.9 Create ClusterIssuers (staging + prod)

You had an existing working ClusterIssuer template. Here’s the same structure (Cloudflare DNS-01, token-based):

**Where:** `ms-1`

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl apply -f - <<'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod-dns01
spec:
  acme:
    email: a.r.kakde@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod-dns01-private-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token
EOF

kubectl get clusterissuer
```

**Tip (best practice):** also create a staging issuer:

* Same YAML but:

    * `name: letsencrypt-staging-dns01`
    * `server: https://acme-staging-v02.api.letsencrypt.org/directory`

**Verify issuers:**

```bash
kubectl describe clusterissuer letsencrypt-prod-dns01 | sed -n '1,160p'
```

---

### 5.10 Issue a certificate for `whoami.kakde.eu` and attach it to the Ingress

#### Create a Certificate resource

**Where:** `ms-1`

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl -n apps apply -f - <<'EOF'
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: whoami-kakde-eu
  namespace: apps
spec:
  secretName: whoami-kakde-eu-tls
  issuerRef:
    name: letsencrypt-prod-dns01
    kind: ClusterIssuer
  dnsNames:
    - whoami.kakde.eu
EOF
```

#### Add TLS to the Ingress (use the secret created by cert-manager)

**Where:** `ms-1`

```bash
kubectl -n apps patch ingress whoami --type='merge' -p '{
  "spec": {
    "tls": [
      {
        "hosts": ["whoami.kakde.eu"],
        "secretName": "whoami-kakde-eu-tls"
      }
    ]
  }
}'
```

#### Watch issuance progress

**Where:** `ms-1`

```bash
kubectl -n apps get certificate,certificaterequest,order,challenge -o wide
kubectl -n apps describe certificate whoami-kakde-eu | sed -n '1,220p'
kubectl -n apps get secret whoami-kakde-eu-tls
```

#### Final external TLS verification (no `-k`)

**Where:** external machine

```bash
curl -sS -I https://whoami.kakde.eu/
curl -sS https://whoami.kakde.eu/ | head
```

---

## 6. Validation checklist (“good looks like”)

### Traefik edge validation

On `ctb-edge-1`:

* `ss -lntp` shows Traefik on `*:80` and `*:443`
* `curl -I http://127.0.0.1/` returns `308` redirect to HTTPS

### whoami routing validation

On `ctb-edge-1`:

* `curl -k -H 'Host: whoami.kakde.eu' https://127.0.0.1/` returns `200` and whoami output

From outside:

* `curl -I https://whoami.kakde.eu/` returns success (no `-k`)
* Browser shows a valid Let’s Encrypt cert for `whoami.kakde.eu`

### cert-manager validation

On `ms-1`:

* `kubectl -n cert-manager get pods` all Running
* `kubectl get clusterissuer` shows issuers present
* `kubectl -n apps get certificate` shows `Ready=True`
* TLS secret exists: `whoami-kakde-eu-tls`

---

## 7. Troubleshooting and quick fixes

### Symptom: HTTP works but HTTPS returns 404

**Cause:** Ingress has no TLS router for that host.
**Fix:** Add Traefik TLS annotation and/or `spec.tls`.

Commands:

```bash
kubectl -n apps annotate ingress whoami traefik.ingress.kubernetes.io/router.tls="true" --overwrite
kubectl -n apps patch ingress whoami --type='merge' -p '{"spec":{"tls":[{"hosts":["whoami.kakde.eu"],"secretName":"whoami-kakde-eu-tls"}]}}'
```

### Symptom: Traefik rollout stuck / Pending pod during upgrades

**Cause:** host ports 80/443 can’t be held by two pods at once; rolling update creates surge pod.
**Fix:** use `maxSurge=0` or `Recreate`, and delete pending surge pod.

### Symptom: cert-manager Challenge stuck / never becomes Ready

Common causes:

* Cloudflare token missing permissions
* Wrong zone / DNS name mismatch
* DNS propagation delay
* Wrong issuer reference name

Useful commands:

```bash
kubectl -n apps describe challenge -l acme.cert-manager.io/order-name
kubectl -n cert-manager logs deploy/cert-manager --tail=200
```

---

## 8. Decisions made, assumptions, and unresolved gaps

### Decisions made

* Traefik runs **only on ctb-edge-1** and binds host ports 80/443.
* Rollout deadlock was solved using **maxSurge=0 / Recreate** (hostPort safe rollout).
* `whoami` was used as the first “known good” ingress test service.
* TLS was moved to **cert-manager + Cloudflare DNS-01** for production-grade certificate management.

### Assumptions

* DNS A record `whoami.kakde.eu → 198.51.100.25` exists.
* cert-manager is allowed to update DNS records via Cloudflare token.
* Traefik is configured to watch Ingress resources and use the relevant IngressClass.

### Unresolved gaps (next phase topics)

* Full firewall policy review for all nodes (edge-only public exposure)
* NetworkPolicies baseline (default-deny + explicit allow)
* Pod Security Admission (PSA) baseline/restricted
* Backup strategy (k3s state, manifests, secrets)
* Monitoring/logging approach

---

## 9. Glossary (simple definitions)

* **Ingress Controller (Traefik):** a Kubernetes component that accepts HTTP/HTTPS traffic and routes it to the right service.
* **Ingress:** a Kubernetes object that defines rules like “host X goes to service Y”.
* **TLS:** encryption for HTTPS.
* **Let’s Encrypt:** free certificate authority that issues trusted TLS certificates.
* **cert-manager:** Kubernetes controller that automatically requests/renews certificates and stores them in Secrets.
* **ClusterIssuer:** a cluster-wide cert-manager configuration that defines how to get certs (e.g., Let’s Encrypt + DNS provider).
* **DNS-01 challenge:** validation method where Let’s Encrypt checks a DNS TXT record to prove domain ownership.
* **Cloudflare API token:** credential cert-manager uses to create DNS records automatically.

---

## 10. Next phase preview + next-document prompt

### What “next phase” means here

You’ve now got:

* stable edge ingress
* a working app behind it
* automated TLS issuance via cert-manager

The next phase is about **hardening** and **operational readiness**:

* firewall rules (edge-only open ports)
* lock down SSH
* network policy defaults
* RBAC sanity checks
* monitoring/backups/runbooks

### Prompt for your next document (copy/paste)

Homelab-0 Phase 5: Traefik is stable edge-only on ctb-edge-1 (host ports 80/443). whoami.kakde.eu routes correctly and has a valid Let’s Encrypt certificate issued by cert-manager using Cloudflare DNS-01 ClusterIssuer. Next I want to harden and productionize the setup: (1) audit exposed ports and firewall rules on all 4 nodes, ensure only edge has 80/443 public, (2) restrict SSH to my admin IP(s), (3) ensure K3s API is not publicly exposed, (4) apply a baseline NetworkPolicy strategy (default deny + required allows), (5) set Pod Security Admission (baseline or restricted) per namespace, (6) quick observability (logs/metrics) and backup strategy. Please provide step-by-step commands with STOP/GO checkpoints, and verification for each change.

---

## 11. Learning links (official / high-quality)

* Traefik Kubernetes Ingress docs: [https://doc.traefik.io/traefik/providers/kubernetes-ingress/](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)
* cert-manager docs: [https://cert-manager.io/docs/](https://cert-manager.io/docs/)
* cert-manager + Cloudflare DNS-01: [https://cert-manager.io/docs/configuration/acme/dns01/cloudflare/](https://cert-manager.io/docs/configuration/acme/dns01/cloudflare/)
* Let’s Encrypt challenge types (HTTP-01 vs DNS-01): [https://letsencrypt.org/docs/challenge-types/](https://letsencrypt.org/docs/challenge-types/)
* Kubernetes Ingress concept: [https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)
* Kubernetes NetworkPolicies: [https://kubernetes.io/docs/concepts/services-networking/network-policies/](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
* Pod Security Admission (PSA): [https://kubernetes.io/docs/concepts/security/pod-security-admission/](https://kubernetes.io/docs/concepts/security/pod-security-admission/)
