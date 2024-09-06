# 🌐 Nginx Setup:

## Configuration involving the
`cloud-vm` with AlmaLinux 9, NGINX, Kubernetes, and the WireGuard tunnel configuration between `cloud-vm` and
`worker-01`.

Reference blog post
👉 [blog post](https://www.cyberciti.biz/faq/issue-lets-encrypt-wildcard-certificate-with-acme-sh-and-cloudflare-dns/)

---

### **Step 1: 🛡️ Obtain Cloudflare API Key**

1. **Obtain your Cloudflare API key** if you haven’t already.
2. **Store the API key** securely on your server:
   ```bash
   mkdir -p $HOME/secrets
   echo "Your_Cloudflare_DNS_API_Key_Goes_here" > $HOME/secrets/dns_cloudflare_api_token
   ```

---

### **Step 2: 💻 Install acme.sh Client**

1. **Log in as the root user**:
   ```bash
   sudo -i
   ```
2. **Clone the acme.sh repository**:
   ```bash
   cd /tmp/
   git clone https://github.com/acmesh-official/acme.sh
   ```
3. **Install the acme.sh client**:
   ```bash
   cd /tmp/acme.sh/
   ./acme.sh --install --accountemail a.r.kakde@gmail.com
   ```
4. **Set the default CA to Let’s Encrypt**:
   ```bash
   ./acme.sh --set-default-ca --server letsencrypt
   ```

---

### **Step 3: 🔒 Issue Let’s Encrypt Wildcard Certificate**

1. **Export the Cloudflare API token**:
   ```bash
   export CF_Token=$(cat /root/secrets/dns_cloudflare_api_token)
   ```
2. **Issue the wildcard certificate** for your domain:
   ```bash
   ./acme.sh --issue --dns dns_cf --ocsp-must-staple --keylength 4096 -d example.com -d '*.example.com'
   ```

---

### **Step 4: 🔧 Configure NGINX on `cloud-vm`**

1. **Create a directory for the SSL certificates**:
   ```bash
   mkdir -p /etc/nginx/ssl/example.com/
   ```
2. **Generate the Diffie-Hellman key exchange file**:
   ```bash
   openssl dhparam -out /etc/nginx/ssl/example.com/dhparams.pem -dsaparam 4096
   ```

   Copy all the certificates from .acme.sh to /etc/nginx/ssl/example.com/
    ```bash 
    cp /root/.acme.sh/example.com/* /etc/nginx/ssl/example.com/
    ```

3. **Edit the NGINX configuration**:
   ```bash
   vi /etc/nginx/nginx.conf
   ```

Replace the contents with the following, adjusting paths and domain names as per your actual setup:

```nginx configuration
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    # HTTP redirect to HTTPS
    server {
        listen      80 default_server;
        listen [::]:80 default_server;
        server_name *.example.com;
        access_log  off;
        error_log   off;
        root        /var/www/html;
        return 301 https://$host$request_uri;
    }

    #upstream k8s_cluster {
    #  server 10.0.0.3:32080;
    #}

    # HTTPS server
    server {

        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name *.example.com;

        # SSL Configuration
        ssl_trusted_certificate /etc/nginx/ssl/example.com/example.com.fullchain.cer;
        ssl_certificate /etc/nginx/ssl/example.com/example.com.fullchain.cer;
        ssl_certificate_key /etc/nginx/ssl/example.com/example.com.key;
        ssl_dhparam /etc/nginx/ssl/example.com/dhparams.pem;

        ssl_session_timeout 1d;
        ssl_session_cache shared:NginxSSL:10m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always; # add_header X-Frame-Options "DENY" always;
        add_header X-Xss-Protection "1; mode=block" always;
        add_header Referrer-Policy  strict-origin-when-cross-origin always;

        ssl_stapling on;
        ssl_stapling_verify on;

        resolver 1.1.1.1 8.8.8.8 valid=300s;
        resolver_timeout 5s;

        # Proxy to APISIX Gateway on k8s_apisix_cluster
        location / {
            # root   /var/www/html;
            # index  index.html;
            proxy_pass http://10.0.0.3:32352;  # Redirecting to nginx-ingress
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            # proxy_set_header X-Client-Verify SUCCESS;
            # proxy_set_header X-Client-DN $ssl_client_s_dn;
            # proxy_set_header X-SSL-Subject $ssl_client_s_dn;
            # proxy_set_header X-SSL-Issuer $ssl_client_i_dn;
        }

        access_log /var/log/nginx/example.com_access.log;
        error_log  /var/log/nginx/example.com_error.log;
    }
}
```

4. 🧪 **Test and reload NGINX**:
   ```bash
   nginx -t && systemctl reload nginx
   ```

---

### **Step 5: 🔄 Install the Wildcard Certificate**

1. **Install your wildcard certificate** with `acme.sh`:
   ```bash
   DOMAIN="example.com"
   CONFIG_ROOT="/etc/nginx/ssl/${DOMAIN}"
   acme.sh -d "$DOMAIN" \
   --install-cert \
   --reloadcmd "systemctl reload nginx" \
   --fullchain-file "${CONFIG_ROOT}/$DOMAIN.fullchain.cer" \
   --key-file "${CONFIG_ROOT}/$DOMAIN.key" \
   --cert-file "${CONFIG_ROOT}/$DOMAIN.cer"
   ```

---

### **Step 6: ⏰ Setup Automatic Renewal**

1. **Verify cron jobs for automatic renewal**:
   ```bash
   crontab -l
   ```
   You should see an entry similar to:
   ```bash
   [root@cloud-vm acme.sh]# crontab -l
   16 20 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
   ```

However, if the need arises, we can also do the manual TLS/SSL cert renewal. Here is how to forcefully renew Let’s
Encrypt DNS wildcard certificate:

```bash 
./acme.sh --renew --force --dns dns_cf --ocsp-must-staple --keylength 4096 -d example.com -d '*.example.com'
```

---

### **Step N/A: (Optional) 🛠️ Setup a Renewal Hook to Propagate Certificates to Other Nodes (e.g., Kubernetes worker
nodes)**

#### **1. 📜 Context and Purpose**

The primary purpose of the renewal hook is to ensure that all the nodes in your environment that require SSL
certificates have the most up-to-date versions. When a wildcard certificate is renewed on the `cloud-vm`, it needs to be
distributed to other nodes (e.g., `worker-01`) to ensure consistent SSL/TLS security across your infrastructure.

Without this propagation, the certificates on the worker nodes would become outdated, leading to potential security
issues and communication failures between nodes or with external clients. This step automates the distribution process,
removing the need for manual intervention each time a certificate is renewed.

#### **2. 🧩 Breakdown of the Logic**

- **Script Creation**:
    - A bash script (`renew_successfully_renewed_certificate.sh`) is created that uses `rsync` to copy the renewed
      certificates from the `cloud-vm` to the specified nodes (e.g., `worker-01`).
    - The script also includes an SSH command to reload NGINX on the remote nodes to apply the new certificates.

- **Adding a Renewal Hook to acme.sh**:
    - The `acme.sh` tool is configured to execute this script automatically whenever the SSL certificate is renewed.
      This is done using the `--renew-hook` option.

- **SSH Key Setup**:
    - The script assumes that passwordless SSH access is set up between the `cloud-vm` and the other nodes, allowing
      `rsync` and SSH commands to execute without manual password entry.

#### **3. 🔍 Why This Is Needed**

- **Consistency**: Ensures that all nodes have the latest SSL certificates without manual updates.
- **Automation**: Reduces the potential for human error by automating the process of certificate distribution.
- **Security**: Keeps your environment secure by ensuring all nodes promptly adopt the latest certificates.

#### **Steps to Implement This Logic**

1. **Set Up SSH Key-Based Authentication**:
    - On the `cloud-vm`, generate an SSH key pair if you haven’t already:
      ```bash
      ssh-keygen -t rsa -b 4096
      ```
    - Copy the public key to each of the worker nodes (e.g., `worker-01`):
      ```bash
      ssh-copy-id root@worker-01
      ```

2. **Create the Renewal Script**:
    - On the `cloud-vm`, create the script to propagate the certificates:
      ```bash
      sudo vi /root/renew_successfully_renewed_certificate.sh
      ```
    - Add the following content:
      ```bash
      #!/bin/bash
      user="your-ssh-username"  # Replace with your actual SSH username
      for i in worker-01; do
          rsync -a --numeric-ids /etc/nginx/ssl/example.com/ ${user}@${i}:/etc/nginx/ssl/example.com
          ssh ${user}@${i} /bin/systemctl reload nginx
      done
      ```
    - Save and make the script executable:
      ```bash
      sudo chmod +x /root/renew_successfully_renewed_certificate.sh
      ```

3. **Configure acme.sh to Use the Renewal Hook**:
    - Update the `acme.sh` configuration to use the newly created script as a renewal hook:
      ```bash
      DOMAIN="example.com"
      CONFIG_ROOT="/etc/nginx/ssl/${DOMAIN}"
      ./acme.sh -d "$DOMAIN" \
      --install-cert \
      --reloadcmd "systemctl reload nginx" \
      --fullchain-file "${CONFIG_ROOT}/$DOMAIN.fullchain.cer" \
      --key-file "${CONFIG_ROOT}/$DOMAIN.key" \
      --cert-file "${CONFIG_ROOT}/$DOMAIN.cer" \
      --renew-hook /root/renew_successfully_renewed_certificate.sh
      ```

4. **Testing the Setup**:
    - You can simulate a certificate renewal and ensure the hook works correctly by forcefully renewing the certificate:
      ```bash
      ./acme.sh --renew --force --dns dns_cf --ocsp-must-staple --keylength 4096 -d example.com -d '*.example.com'
      ```
    - Check that the certificates have been updated on the worker nodes and that NGINX was reloaded successfully.

**Conclusion**:

The renewal hook ensures that your entire environment stays secure and up-to-date with the latest SSL certificates. By
automating the propagation of these certificates, you reduce the risk of human error and maintain consistent security
across all nodes in your setup.

---

### **Understanding `--pre-hook` and `--post-hook` in acme.sh**

#### **Purpose of `--pre-hook` and `--post-hook`**

- **`--pre-hook`**: This hook is a command or script that runs before acme.sh attempts to obtain or renew a certificate.
  It’s useful for preparing the environment before the certificate process starts. For instance, you might need to stop
  certain services, create backups, or perform other preparatory tasks that ensure the certificate process can run
  smoothly.

- **`--post-hook`**: This hook runs after acme.sh has finished attempting to obtain or renew a certificate, regardless
  of whether the operation was successful or not. This is useful for cleanup operations, restarting services that were
  stopped during the `--pre-hook`, or notifying administrators of the outcome.

#### **Do You Need These Hooks?**

The necessity of these hooks depends on your specific environment and workflow:

- **If your environment requires certain services to be stopped or prepared before renewing a certificate**, then a
  `--pre-hook` is useful.

- **If you need to restart services, notify other systems, or perform cleanup tasks after certificate renewal**, a
  `--post-hook` can be beneficial.

In the context of your current setup, these hooks might not be strictly necessary if everything runs smoothly with the
`--renew-hook`. However, if you have additional steps that must be executed before or after the renewal process, these
hooks can be very helpful.

#### **Implementing `--pre-hook` and `--post-hook` in Your Setup**

Here’s how you can implement and utilize the `--pre-hook` and `--post-hook` options in acme.sh:

#### **1. Scenario Example for `--pre-hook`**

- **Use Case**: Suppose you need to stop NGINX before the renewal process to prevent it from serving requests while the
  certificates are being updated.

- **Implementation**:
    - Create a pre-hook script:
      ```bash
      sudo vi /root/pre_renew_certificates.sh
      ```
    - Add the following content:
      ```bash
      #!/bin/bash
      # Stop NGINX before certificate renewal
      systemctl stop nginx
      ```
    - Save and make the script executable:
      ```bash
      sudo chmod +x /root/pre_renew_certificates.sh
      ```

#### **2. Scenario Example for `--post-hook`**

- **Use Case**: After renewing the certificates, you may need to restart NGINX and notify administrators via email.

- **Implementation**:
    - Create a post-hook script:
      ```bash
      sudo vi /root/post_renew_certificates.sh
      ```
    - Add the following content:
      ```bash
      #!/bin/bash
      # Start NGINX after certificate renewal
      systemctl start nginx
      
      # Notify admin
      echo "SSL Certificates have been renewed and NGINX restarted on $(hostname)" | mail -s "Certificate Renewal Notification" admin@example.com
      ```
    - Save and make the script executable:
      ```bash
      sudo chmod +x /root/post_renew_certificates.sh
      ```

#### **3. Integrating the Hooks with acme.sh**

After creating the `--pre-hook` and `--post-hook` scripts, you integrate them into the acme.sh process as follows:

```bash
DOMAIN="example.com"
CONFIG_ROOT="/etc/nginx/ssl/${DOMAIN}"
./acme.sh -d "$DOMAIN" \
--install-cert \
--reloadcmd "systemctl reload nginx" \
--fullchain-file "${CONFIG_ROOT}/$DOMAIN.fullchain.cer" \
--key-file "${CONFIG_ROOT}/$DOMAIN.key" \
--cert-file "${CONFIG_ROOT}/$DOMAIN.cer" \
--pre-hook /root/pre_renew_certificates.sh \
--post-hook /root/post_renew_certificates.sh \
--renew-hook /root/renew_successfully_renewed_certificate.sh
```

#### **Summary of Hook Purposes**

- **`--pre-hook`**: Prepares the environment for certificate renewal (e.g., stopping services, making backups).
- **`--post-hook`**: Finalizes the environment after certificate renewal (e.g., restarting services, sending
  notifications).
- **`--renew-hook`**: Specifically used to propagate certificates to other nodes and reload services after renewal.

**Conclusion**:

Using `--pre-hook` and `--post-hook` hooks in conjunction with `--renew-hook` can provide a comprehensive automation
process for managing SSL certificates. These hooks ensure that all necessary preparatory and cleanup tasks are handled
automatically, reducing the need for manual intervention and minimizing the risk of errors during the certificate
renewal process. Whether you need them depends on your specific requirements, but they can be very useful in complex or
production environments.

---

### **Step 6: 🧪 Testing**

1. **Verify NGINX is serving requests** and redirecting traffic correctly to the `worker-01` through the WireGuard
   tunnel.
2. **Test the SSL configuration** using tools like: **SSL Labs** <https://www.ssllabs.com/ssltest/>
   ```bash
   testssl.sh -- fast --parallel https://www.example.com/
   ```

Qualys SSL Labs | https://www.ssllabs.com/projects/index.html | SSL Security Tools by Qualys

---

### **Step 7: 🛠️ Troubleshooting and Maintenance**

1. **Monitor logs**:
   ```bash
   tail -f /var/log/nginx/example.com_access.log
   tail -f /var/log/nginx/example.com_error.log
   ```
2. **Manual certificate renewal (if necessary)**:
   ```bash
   acme.sh --renew --force --dns dns_cf --ocsp-must-staple --keylength 4096 -d example.com -d '*.example.com'
   ```

By following these instructions, you’ll set up a secure and automated system for managing SSL certificates with NGINX
acting as a reverse proxy, utilizing APISIX as a load balancer for your Kubernetes cluster, all secured through a
WireGuard tunnel.

---

### **Step 8: 🧹 To automate the deletion of logs older than 7 days, follow these steps:**

#### **Create a Script to Delete Old Logs**

1. **Create the script** that will delete logs older than 7 days:
   ```bash
   sudo vi /usr/local/bin/delete_old_nginx_logs.sh
   ```
2. **Add the following content to the script**:
   ```bash
   #!/bin/bash
   # Script to delete NGINX logs older than 7 days
   LOG_DIR="/var/log/nginx"
   ACCESS_LOG="${LOG_DIR}/example.com_access.log"
   ERROR_LOG="${LOG_DIR}/example.com_error.log"

   # Find and delete main access logs older than 7 days
   find "$LOG_DIR" -type f -name "access.log*" -mtime +7 -exec rm -f {} \;
   
   # Find and delete access logs older than 7 days
   find "$LOG_DIR" -type f -name "example.com_access.log*" -mtime +7 -exec rm -f {} \;

   # Find and delete error logs older than 7 days
   find "$LOG_DIR" -type f -name "example.com_error.log*" -mtime +7 -exec rm -f {} \;
   ```

3. **Save and exit the editor**.

4. **Make the script executable**:
   ```bash
   sudo chmod +x /usr/local/bin/delete_old_nginx_logs.sh
   ```

#### **Create a Cron Job to Run the Script Daily**

1. **Open the crontab file** for the root user:
   ```bash
   sudo crontab -e
   ```
2. **Add the following cron job** to execute the script daily at midnight (00:00):
   ```bash
   0 0 * * * /usr/local/bin/delete_old_nginx_logs.sh > /dev/null 2>&1
   ```
   This cron job will run the `delete_old_nginx_logs.sh` script every day at midnight and delete any NGINX logs that are
   older than 7 days.

3. **Save and close the crontab editor**.

### **Verify the Setup**

1. **Check if the cron job is set correctly**:
   ```bash
   sudo crontab -l
   ```
   You should see the entry:
   ```text
   0 0 * * * /usr/local/bin/delete_old_nginx_logs.sh > /dev/null 2>&1
   ```

2. **Optionally, run the script manually** to ensure it works as expected:
   ```bash
   sudo /usr/local/bin/delete_old_nginx_logs.sh
   ```

By following these steps, you’ve set up a script that will automatically delete NGINX logs older than 7 days, and a cron
job that runs the script daily at midnight to keep your log directory clean.

---