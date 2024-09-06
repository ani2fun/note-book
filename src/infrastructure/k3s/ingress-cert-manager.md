# **🔐 **Securing Ingress Using Cert-Manager****

---

## **⚙️ **1. Setting Up Cert-Manager for TLS Certificates****

Cert-Manager automates the management of TLS certificates.

### **Install Cert-Manager**

- **Add and Update Repo for Cert-Manager using Helm:**

    ```bash
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    ```

- **Install Cert-Manager into the cert-manager namespace by running the following command:**

    ```bash
    helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.15.3 --set crds.enabled=true
    ```

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

### **🛠️ **2. Create a ClusterIssuer****

- **Create an issuer called "prod-clusterissuer-http01.yaml":**

    ```bash
    cat <<EOF > prod-clusterissuer-http01.yaml
    apiVersion: cert-manager.io/v1
    kind: ClusterIssuer
    metadata:
      name: letsencrypt-prod-http01
    spec:
      acme:
        # Email address used for ACME registration
        email: email@example.com
        server: https://acme-v02.api.letsencrypt.org/directory
        privateKeySecretRef:
          # Name of a secret used to store the ACME account private key
          name: letsencrypt-prod-http01-private-key
        # Add a single challenge solver, HTTP01 using nginx
        solvers:
          - http01:
              ingress:
                class: nginx
    EOF
    ```

- This configuration defines a ClusterIssuer that contacts Let’s Encrypt in order to issue certificates. You’ll need to
  replace your_email_address with your email address to receive any notices regarding the security and expiration of
  your certificates.


- **Roll out with kubectl:**
    ```bash
    kubectl apply -f prod-clusterissuer-http01.yaml
    ```

- **You should see the following output:**

    ```text
    Output
    clusterissuer.cert-manager.io/letsencrypt-prod-http01
    ```

- **Edit the previously created `kuard-ingress.yaml` file to include the ClusterIssuer information:**

  The updated file should look something like this:

    ```bash
    cat <<EOF > prod-clusterissuer-http01.yaml
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
          - kuard1.example.com
          secretName: kuard-k8s-tls
      rules:
        - host: "kuard1.example.com"
          http:
            paths:
              - path: "/"
                pathType: Prefix
                backend:
                  service:
                    name: kuard-k8s-first
                    port:
                      number: 80
    EOF
    ```

- The tls block under spec defines what Secret will store the certificates for your sites (listed under hosts), which
  the letsencrypt-prod-http01 ClusterIssuer issues. The secretName must be different for every Ingress you create.

- **Roll out with kubectl:**
    ```bash
    kubectl apply -f prod-clusterissuer-http01.yaml
    ```

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

- **When the last line of output reads The certificate has been successfully issued, you can exit by pressing CTRL + C.
  **

- **Now visit the website from your web browser https://kuard1.example.com**

---