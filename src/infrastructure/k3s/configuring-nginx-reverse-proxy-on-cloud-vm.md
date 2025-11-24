## 🔄 Configuring NGINX Reverse Proxy on Cloud VM

--- 

### Why Set Up a Reverse Proxy?
- **Entry Point**: The cloud VM’s public IP becomes the gateway for external traffic, forwarding requests to the cluster’s NGINX Ingress controller.
- **Simplifies Access**: Allows your domain to point to a single IP, hiding internal complexity.

- The main purpose of this setup is to forward HTTP and HTTPS traffic for the domain **kakde.eu** to the LoadBalancer
  service, specifically the **nginx-ingress-ingress-nginx-controller**.
- **CloudVM’s Public IP** is used for this traffic forwarding.
- Make sure that in Cloudflare or your DNS provider, type `A` entry is added which points to public ip address of
  Cloud-VM.
- **Cloud-VM** serves as the entry point, and its IP is assigned in the DNS provider settings (using **Cloudflare**).
- Since **master-01** and **worker-01** don’t have dedicated public IPs, they are behind a **NAT (Network Address
  Translation)** provided by the ISP router.
- This means the public IP visible to the outside world is the router’s IP, not the IPs of **master-01** or **worker-01
  **.

### 1. Install NGINX
- **Command** (run on `cloud-vm`):
  ```bash
  sudo dnf install nginx -y
  ```
- **Why**: Installs NGINX to handle incoming HTTP/HTTPS traffic and forward it to the cluster.

### 2. Configure NGINX
- **Action**: Create `/etc/nginx/sites-available/default` on `cloud-vm`:
  ```nginx
  server {
      listen 80;
      server_name kakde.eu *.kakde.eu;
      location / {
          proxy_pass http://172.16.100.10;  # NGINX Ingress IP from MetalLB. Forward to LoadBalancer service `nginx-ingress-ingress-nginx-controller`.
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  server {
      listen 443 ssl;
      server_name kakde.eu *.kakde.eu;
      location / {
          proxy_pass http://172.16.100.10;  # Forward to Ingress (SSL terminated by Ingress). Forward to LoadBalancer service `nginx-ingress-ingress-nginx-controller`.
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```
- **Why**: Configures NGINX to forward all traffic for `kakde.eu` and subdomains to the NGINX Ingress controller’s IP (`172.16.100.11`).
- **Explanation**: Headers preserve client information (e.g., IP, protocol) for downstream services. SSL is handled by Ingress, so `proxy_pass` uses HTTP.


### 3. Enable Configuration (if needed)
- **Commands** (run on `cloud-vm`):
  ```bash
  sudo mkdir -p /etc/nginx/sites-enabled
  sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
  ```
- **Why**: Links the configuration to `sites-enabled`, activating it (required on some systems like Debian; optional on Fedora/AlmaLinux).

### 4. Test and Reload NGINX
- **Commands** (run on `cloud-vm`):
  ```bash
  sudo nginx -t
  sudo systemctl reload nginx
  ```
- **Why**: `nginx -t` validates the configuration syntax, and `reload` applies changes without interrupting active connections.

### 5. Update DNS
- **Action**: In your domain registrar’s DNS settings, set an `A` record for `kakde.eu` and `*.kakde.eu` to the `cloud-vm`’s public IP (e.g., `<CLOUD_VM_PUBLIC_IP>`).
- **Why**: Directs external traffic to the reverse proxy, which forwards it to the cluster.

---

### 6. Test sample Application - Kuard App

- **Create an Ingress resource to expose the Kuard application:**

  ```bash
  cat <<EOF > kuard-ingress.yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: kuard-k8s-ingress
  spec:
    ingressClassName: nginx
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
  EOF
  ```

- **Roll out:**
  ```bash
  kubectl create -f kuard-ingress.yaml
  ```


**Check in your browsers incognito mode to access it:**

[http://kuard1.kakde.eu](http://kuard1.kakde.eu)

---
