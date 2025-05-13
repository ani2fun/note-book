## **🔐 **Securing Ingress Using Cert-Manager****

---

## Why Use Cert-Manager?
- **Automation**: Automatically issues and renews TLS certificates from Let’s Encrypt, simplifying security management.
- **Secure Access**: Ensures external connections to your applications are encrypted, protecting data in transit.

---

## ⚙️ Setting Up Cert-Manager for TLS Certificates

### 1. Install Cert-Manager

- **Commands** (run on `master-01`):
  ```bash
  helm repo add jetstack https://charts.jetstack.io
  helm repo update
  helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.15.3 --set crds.enabled=true
  ```
- **Why**: Installs Cert-Manager in its own namespace (`cert-manager`) with custom resource definitions (CRDs) for certificate management.

- **Expected output:**
    ```text
    Output
    NAME: cert-manager
    LAST DEPLOYED: Wed Sept 2 19:46:39 2024
    NAMESPACE: cert-manager
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    cert-manager v1.15.3 has been deployed successfully!
    ...
    ```

- **The `NOTES` of the output (which has been truncated in the display above) states that you need to set up an Issuer
  to issue TLS certificates.**

---

### 2. Create a ClusterIssuer

- **Action**: Create a file named `prod-clusterissuer-http01.yaml` on `master-01`:
  ```yaml
  apiVersion: cert-manager.io/v1
  kind: ClusterIssuer
  metadata:
    name: letsencrypt-prod-http01
  spec:
    acme:
      # Email address used for ACME registration
      email: your_email@kakde.eu
      server: https://acme-v02.api.letsencrypt.org/directory
      privateKeySecretRef:
        # Name of a secret used to store the ACME account private key
        name: letsencrypt-prod-http01-private-key
      # Add a single challenge solver, HTTP01 using nginx
      solvers:
        - http01:
            ingress:
              class: nginx
  ```
- **Why**: Defines a cluster-wide issuer for obtaining certificates from Let’s Encrypt using the HTTP-01 challenge (proving domain ownership via HTTP).
- **Explanation**: The `email` receives renewal notices, and `nginx` specifies the Ingress class to handle challenges.

---

### 3. Apply ClusterIssuer
- **Command** (run on `master-01`):
  ```bash
  kubectl apply -f prod-clusterissuer-http01.yaml
  ```
- **Why**: Registers the `ClusterIssuer`, enabling Cert-Manager to issue certificates.

- **You should see the following output:**
    ```text
    Output
    clusterissuer.cert-manager.io/letsencrypt-prod-http01
    ```

---

### 4. Update Ingress for TLS

- **Action**: Create a file named `kuard-ingress.yaml` on `master-01` or Edit the previously created `kuard-ingress.yaml` file to include the ClusterIssuer information:
  ```yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: kuard-k8s-ingress
    annotations:
      cert-manager.io/cluster-issuer: letsencrypt-prod-http01
  spec:
    ingressClassName: nginx
    tls:
      - hosts:
          - kuard1.kakde.eu
        secretName: kuard-k8s-tls
    rules:
      - host: "kuard1.kakde.eu"
        http:
          paths:
            - path: "/"
              pathType: Prefix
              backend:
                service:
                  name: kuard-k8s-first
                  port:
                    number: 80
  ```
- **Why**: Configures an `Ingress` resource to route traffic to a sample service (`kuard-k8s-first`) and requests a TLS certificate for `kuard1.kakde.eu`.
- **Explanation**: The `annotations` trigger Cert-Manager, and `tls` specifies the domain and secret for the certificate. The tls block under spec defines what Secret will store the certificates for your sites (listed under hosts), which
  the letsencrypt-prod-http01 ClusterIssuer issues. The secretName must be different for every Ingress you create.

---

### 5. Apply Ingress

- **Command** (run on `master-01`):
  ```bash
  kubectl apply -f kuard-ingress.yaml
  ```
- **Why**: Creates the `Ingress` resource, prompting Cert-Manager to issue the certificate and NGINX to enforce HTTPS.

- **Expected output:**
    ```text
    Output
    ingress.networking.k8s.io/hello-kubernetes-ingress configured
    ```

- Wait a few minutes for the Let’s Encrypt servers to issue a certificate for your domains. In the meantime, you can
  track progress by inspecting the output of the following command:

    ```bash
    kubectl describe certificate kuard-k8s-tls
    ```

- The end of the output will be similar to this:

    ```text
    ...
    Output
    Events:
    Type    Reason     Age    From                                       Message
      ----    ------     ----   ----                                       -------
    Normal  Issuing    2m34s  cert-manager-certificates-trigger          Issuing certificate as Secret does not exist
    Normal  Generated  2m34s  cert-manager-certificates-key-manager      Stored new private key in temporary Secret resource "kuard-k8s-tls-jkdgg"
    Normal  Requested  2m34s  cert-manager-certificates-request-manager  Created new CertificateRequest resource "kuard-k8s-tls-dkllg"
    Normal  Issuing    2m7s   cert-manager-certificates-issuing          The certificate has been successfully issued
    ```

- **When the last line of output reads The certificate has been successfully issued, you can exit by pressing CTRL + C.**

- **Now visit the website from your web browser: `https://kuard1.kakde.eu`**

---