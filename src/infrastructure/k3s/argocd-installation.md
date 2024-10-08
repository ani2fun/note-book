## **Argocd Installation**

### 🚀 **Steps to Deploy ArgoCD**:

1. **Add the ArgoCD Helm repository**:

   ```bash
   helm repo add argo https://argoproj.github.io/argo-helm
   helm repo update
   ```

2. **📦 **Install ArgoCD using Helm with ClusterIP Service****:

   Since you only want to use your existing NGINX ingress for external access, we will install ArgoCD with a `ClusterIP`
   service and expose it via NGINX.

   ```bash
   helm install argocd argo/argo-cd --namespace argocd --create-namespace \
     --set server.service.type=ClusterIP \
     --set server.ingress.enabled=true \
     --set server.ingress.hosts[0]=argocd.example.com \
     --set server.ingress.ingressClassName=nginx \
     --set server.ingress.tls[0].hosts[0]=argocd.example.com \
     --set server.ingress.tls[0].secretName=argocd-example-tls
   ```

   This installs ArgoCD with a `ClusterIP` service and configures an Ingress for external access at
   `https://argocd.example.com`, with SSL termination managed by NGINX.

3. **🔧 **Configure Ingress for ArgoCD****:

   To ensure proper HTTPS redirection and traffic handling, apply the following ingress configuration. This includes
   annotations to force SSL redirection and increase proxy body size.

   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: argocd-server-ingress
     namespace: argocd
     annotations:
       cert-manager.io/cluster-issuer: letsencrypt-prod-http01
       nginx.ingress.kubernetes.io/ssl-redirect: "true"
       nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
       nginx.ingress.kubernetes.io/proxy-body-size: "512m"  # Increase upload size for ArgoCD
   spec:
     ingressClassName: nginx
     tls:
       - hosts:
         - argocd.example.com
         secretName: argocd-example-tls
     rules:
       - host: argocd.example.com
         http:
           paths:
             - path: /
               pathType: Prefix
               backend:
                 service:
                   name: argocd-server
                   port:
                     number: 80
   ```

4. **🔑 **Modify ArgoCD ConfigMap for SSL Termination****:

   Since SSL is terminated at the NGINX ingress level, configure the ArgoCD `argocd-cm` ConfigMap to disable ArgoCD's
   internal HTTPS redirection. Edit the ConfigMap as follows:

   ```bash
   kubectl edit cm argocd-cm -n argocd
   ```

   Add the following lines under the `data` section:

   ```yaml
   data:
     url: https://argocd.example.com
     server.insecure: "true"  # Allow NGINX to handle SSL termination.
   ```

5. **🔐 **Get ArgoCD Admin Password****:

   Retrieve the initial password for the `admin` user:

   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode
   ```

6. **🖥️ **Access ArgoCD UI****:

   Now you should be able to access ArgoCD via `https://argocd.example.com` and log in using the `admin` username and
   the retrieved password.

---

### ✅ **Testing ArgoCD Setup**

- After logging into ArgoCD, you can add GitHub repositories for your applications (`infra`, etc.).
- Ensure the ArgoCD syncs the application manifests and deployments successfully.

---

### ➡️ **Next Steps: GitHub Actions**

With ArgoCD in place, we can now proceed to update the GitHub Actions workflow to:

1. Automatically build and push new Docker images for `portfolio-app`.
2. Trigger ArgoCD to deploy the new image version by updating the manifests in the `infra` repository.

---

# **🔒 **ArgoCD Admin Password Change and Security Enhancements****

Change the ArgoCD `admin` password, how to configure the ArgoCD CLI, and additional steps to secure your ArgoCD
instance.

---

## **1. 🔑 **Changing the ArgoCD Admin Password****

You can change the admin password either through the ArgoCD UI or using the CLI.

### **1.1 🌐 **Change the Password via ArgoCD Web UI****

1. **Log in to the ArgoCD UI:**
    - Open a browser and go to `https://argocd.example.com`.
    - Use the default admin credentials:
        - Username: `admin`
        - Password: Run this command to retrieve the default password if you don’t have it:
          ```bash
          kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
          ```

2. **Change the Password**:
    - After logging in, click on your profile (top right corner, typically the `admin` username).
    - Select **Account Settings**.
    - Enter your new password and confirm the change.

   This will update your admin password for future logins.

---

### **1.2 💻 **Change the Password via ArgoCD CLI****

If you prefer using the CLI, you can also change the password using the following steps:

#### **1.2.1 Install the ArgoCD CLI**

- Run the following command on your `master-01` node to install the ArgoCD CLI:

   ```bash
   curl -sSL -o /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
   chmod +x /usr/local/bin/argocd
   ```

- Verify the installation:

   ```bash
   argocd version
   ```

  You should see both the client and server versions of ArgoCD.

#### **1.2.2 Login to ArgoCD Server**

- To use the ArgoCD CLI, you must first log into your ArgoCD server:

   ```bash
   argocd login argocd.example.com --username admin --password <new-password> --insecure
   ```

  Replace `<new-password>` with your current password. The `--insecure` flag allows login with untrusted certificates (
  e.g., self-signed or Let's Encrypt).

#### **1.2.3 Change the Admin Password via CLI**

- After logging in, change the password using the following command:

   ```bash
   argocd account update-password --current-password <old-password> --new-password <new-password>
   ```

  Replace `<old-password>` and `<new-password>` with the current and new passwords respectively.

---

### BELOW THIS - OPTIONAL - (Recommended in Production env)

---

## **2. 🌐 **Configuring ArgoCD Server URL****

To avoid specifying the server address with every ArgoCD command, you can configure the ArgoCD server URL in the CLI.

### **2.1 Temporary Login (Per Session)**

- Use this command to log into the ArgoCD server:
    ```bash
    argocd login argocd.example.com --username admin --password <new-password> --insecure
    ```

### **2.2 Permanent Configuration (Environment Variable)**

For convenience, you can set the ArgoCD server URL permanently by configuring it as an environment variable:

1. Open your `.bashrc` or `.bash_profile` file:
   ```bash
   nano ~/.bashrc
   ```

2. Add the following line:
   ```bash
   export ARGOCD_SERVER=argocd.example.com
   ```

3. Save the file and reload it:
   ```bash
   source ~/.bashrc
   ```

Now, you won’t need to specify the server URL every time you use the CLI.

---

## **3. 🔒 **Securing ArgoCD****

Once you've changed the admin password, you should take additional steps to secure the ArgoCD server.

### **3.1 ⛔ **Disable the Default Admin Account** (Optional)**

For improved security, it's a good practice to disable the `admin` account once other users or SSO are configured.

1. Edit the ArgoCD ConfigMap:
   ```bash
   kubectl edit cm argocd-cm -n argocd
   ```

2. Add or modify the following lines under the `data` section:
   ```yaml
   data:
     accounts.admin: apiKey
     admin.enabled: "false"
   ```

3. Save the changes and restart the ArgoCD server to apply the changes:
   ```bash
   kubectl rollout restart deployment argocd-server -n argocd
   ```

### **3.2 🔐 **Set Up Role-Based Access Control (RBAC)** (RBAC)**

- To ensure users have only the permissions they need, configure ArgoCD's RBAC policies. Here's an example ConfigMap
  that creates a read-only role:

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: argocd-rbac-cm
      namespace: argocd
    data:
      policy.csv: |
        p, role:readonly, applications, get, */*, allow
        p, role:readonly, clusters, get, */*, allow
        p, role:readonly, repositories, get, */*, allow
        g, <username>, role:readonly
    ```

This assigns a read-only role to the specified `username`. Adjust the permissions and roles based on your security
needs.

### **3.3 🔑 **Enable OAuth or SSO Authentication****

Integrate ArgoCD with an Identity Provider like GitHub, GitLab, Google, or Okta for SSO. This setup can enforce stricter
policies such as multi-factor authentication (MFA).

You can enable OAuth through ArgoCD's configuration. Details on setting this up can be found in
the [ArgoCD documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/user-management/#oauth2).

### **3.4 🔒 **Enable TLS for Secure Communication****

If you haven’t already, ensure that ArgoCD is running behind a secure Ingress (e.g., NGINX) with TLS certificates
managed by `cert-manager`. This ensures all communications with the ArgoCD server are encrypted.

### **3.5 ⚖️ **Set Resource Limits and Quotas****

Limit ArgoCD's resource consumption by setting CPU and memory requests/limits on the ArgoCD components.

- For example, edit the ArgoCD Helm chart or apply the following manifest to set resource limits:

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: argocd-server
      namespace: argocd
    spec:
      template:
        spec:
          containers:
            - name: argocd-server
              resources:
                limits:
                  cpu: "500m"
                  memory: "512Mi"
                requests:
                  cpu: "250m"
                  memory: "256Mi"
    ```

### **3.6 📊 **Enable Audit Logging****

Enabling audit logs can help track all actions performed by users in ArgoCD. This allows you to detect any suspicious
activity or unauthorized actions.

---