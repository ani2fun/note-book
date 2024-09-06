## 🚀 Setting Up a Kubernetes Cluster with 🦾 K0S and 🔐 WireGuard VPN Tunneling from Cloud VM

Deploying a two-node Kubernetes cluster using k0s on AlmaLinux. The setup involves configuring two nodes as both control
plane and worker nodes, along with detailed instructions for firewall and network configurations.

---

## Prerequisites

**Hardware and Network:**

- **Two Nodes**: `master-01` and `worker-01`.
- **Operating System**: AlmaLinux 9.4 (or any compatible RHEL-based distribution).
- **Network Configuration**: Ensure both nodes can communicate over the network.
- **User Access**: Root access or the ability to use `sudo` is required on both nodes.
- **SSH Access**: Set up SSH key-based authentication between the nodes and your local machine for secure access.

To include the information about the `/etc/hosts` file on the Jumpbox machine, you should add it to the **Environment
Setup** section. This section is where you define the setup details, including the network configuration. Here's how you
can update the documentation:

---

### 📊 Server Overview

| Role                           | Hostname                  | IP Address                   |
|--------------------------------|---------------------------|------------------------------|
| Jumpbox (MacOS/Windows/Linux)  | Jumpbox                   | PRIVATE_IP                   |
| ------------------------------ | ------------------------- | ---------------------------- |
| Control Plane                  | master-01.example.com     | PRIVATE_IP                   |
| Worker Node                    | worker-01.example.com     | PRIVATE_IP                   |
| ------------------------------ | ------------------------- | ---------------------------- |
| External Node                  | cloud-vm.example.com      | PUBLIC_IP                    |
| ------------------------------ | ------------------------- | ---------------------------- |

To update the documentation with the necessary `/etc/hosts` file information for `master-01` and `worker-01`, follow
these steps. You should add this information to the section where you're preparing the nodes, particularly under network
configuration or as a dedicated step.

#### **1. Jumpbox**

```bash
# WIFI
# 192.168.1.130 worker-01.example.com worker-01
<PRIVATE_IP> master-01.example.com

# enp171s0 ethernet ip address for worker-01
<PRIVATE_IP> worker-01.example.com

# Remote Gateway
<PUBLIC_IP> cloud-vm.example.com
```

#### **2. Node Configuration (master-01 and worker-01)**

### 1.6 Configure `/etc/hosts` on Kubernetes Nodes

Ensure that the `/etc/hosts` file on both `master-01` and `worker-01` includes the following entries for proper DNS
resolution within the Kubernetes cluster:

**On `master-01.example.com` and `worker-01.example.com`:**

```bash
<PRIVATE_IP> master-01.example.com master-01
<PRIVATE_IP>  worker-01.example.com worker-01
```

---

## Step 1: Prepare the Nodes

### 1.1 System Update and Essential Packages

1. **Update the System**:
   ```bash
   sudo dnf update -y
   sudo dnf upgrade -y
   ```

2. **Install Essential Packages**:
   ```bash
   sudo dnf install -y epel-release
   sudo dnf install -y vim curl wget net-tools firewalld
   ```

3. **Reboot the System** (if necessary):
   ```bash
   sudo reboot
   ```

### 1.2 Network and SELinux Configuration

1. **Configure SELinux** (if you need to disable or adjust it):
   ```bash
   sudo vi /etc/selinux/config
   ```

- Set `SELINUX=permissive` or `SELINUX=disabled` based on your requirements.
- Reboot the system if you change SELinux settings.

2. **Check Network Interfaces**:
   ```bash
   ifconfig
   ```
   Ensure the interfaces (`enp171s0`, etc.) are configured correctly.

### 1.3 SSH Configuration

1. **Generate SSH Key** (if not already generated):
   ```bash
   ssh-keygen -t ed25519 -C "root@worker-01"
   ```

2. **Copy SSH Keys to Nodes**:
   ```bash
   cat ~/.ssh/id_ed25519.pub | ssh root@master-01.example.com 'cat >> ~/.ssh/authorized_keys'
   cat ~/.ssh/id_ed25519.pub | ssh root@worker-01.example.com 'cat >> ~/.ssh/authorized_keys'
   ```


3. Secure the SSH server by modifying `/etc/ssh/sshd_config`:

```bash
sudo sed -i '/^#Port 22/s/^#//;s/Port 22/Port 2024/; /^#PasswordAuthentication yes/s/^#//;s/PasswordAuthentication yes/PasswordAuthentication no/; /^#PermitRootLogin yes/s/^#//;s/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
```

3. **Enable Root Login on Nodes**:
   Edit the SSH configuration file:
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Set `PermitRootLogin` to `yes` and restart the SSH service:
   ```bash
   sudo systemctl restart sshd
   ```

### 1.4 Set Hostnames on Nodes

On `master-01`:

```bash
hostnamectl set-hostname master-01.example.com
systemctl restart systemd-hostnamed
```

On `worker-01`:

```bash
hostnamectl set-hostname worker-01.example.com
systemctl restart systemd-hostnamed
```

### 1.5 Tune System Performance

1. **Enable and Start Tuned**:
   ```bash
   sudo systemctl start tuned
   sudo systemctl enable tuned
   ```

2. **Verify Tuned Settings**:
   ```bash
   tuned-adm list
   tuned-adm active
   ```

---

## Step 2: Firewall Configuration

### 2.1 Configure Firewall Ports

Run the following commands to configure the firewall on both `master-01` and `worker-01`:

```bash
sudo firewall-cmd --zone=public --permanent --add-port=6443/tcp # Allow traffic for Kubernetes API server
sudo firewall-cmd --zone=public --permanent --add-port=2379-2380/tcp # Allow traffic for etcd (client and peer communication)
sudo firewall-cmd --zone=public --permanent --add-port=10250-10256/tcp # Allow traffic for kubelet
sudo firewall-cmd --zone=public --permanent --add-port=30000-32767/tcp # Allow traffic for NodePort services
sudo firewall-cmd --zone=public --permanent --add-port=8132/tcp # Allow traffic for Konnectivity
sudo firewall-cmd --zone=public --permanent --add-port=4789/udp # Allow traffic for Overlay network (VXLAN for Calico)
sudo firewall-cmd --zone=public --permanent --add-port=53/tcp # Allow traffic for CoreDNS
sudo firewall-cmd --zone=public --permanent --add-port=53/udp # Allow traffic for CoreDNS
sudo firewall-cmd --zone=public --permanent --add-port=80/tcp # Allow traffic for Ingress Controller
sudo firewall-cmd --zone=public --permanent --add-port=443/tcp # Allow traffic for Ingress Controller
sudo firewall-cmd --zone=public --permanent --add-port=179/tcp # Allow traffic for Calico BGP (optional)
sudo firewall-cmd --zone=public --permanent --add-port=179/udp # Allow traffic for Calico BGP (optional)


# Add sources for Pod and Service CIDRs
sudo firewall-cmd --zone=public --permanent --add-source=10.244.0.0/16
sudo firewall-cmd --zone=public --permanent --add-source=10.96.0.0/12

sudo firewall-cmd --zone=public --add-interface=wg0 --permanent # Add network interfaces based on the hosts `wg0` | eth0 etc. (Replace this with what you see using `ifconfig` for the network interface).
sudo firewall-cmd --zone=public --add-interface=eth0 --permanent


# Apply masquerade (for NAT and IP forwarding)
sudo firewall-cmd --zone=public --permanent --add-masquerade

# Reload firewall to apply changes
sudo firewall-cmd --reload

```

### 2.2 Validate Firewall Configuration

Verify that the firewall rules are correctly configured:

```bash
sudo firewall-cmd --list-all
```

---

## Step 3: Install k0s on Both Nodes

### 3.1 Download and Install k0s

On both `master-01` and `worker-01`, install `k0s`:

```bash
curl -sSLf https://get.k0s.sh | sudo sh
```

### 3.2 Verify Installation

Check the `k0s` installation by verifying the version:

```bash
k0s version
```

---

## Step 4: Create and Apply k0sctl Configuration

### 4.1 Install k0sctl on Jumpbox (MacOS)

On your local machine (Jumpbox), install `k0sctl`:

```bash
brew install k0sproject/tap/k0sctl
```

### 4.2 Create k0sctl Configuration File

Generate a `k0sctl.yaml` file with the following content:

```yaml
---
apiVersion: k0sctl.k0sproject.io/v1beta1
kind: Cluster
metadata:
  name: k0s-cluster
spec:
  hosts:
    - role: controller
      ssh:
        address: master-01.example.com
        user: root
        port: 22
        keyPath: /path/to/your/ssh/key
    - role: worker
      ssh:
        address: worker-01.example.com
        user: root
        port: 22
        keyPath: /path/to/your/ssh/key
  k0s:
    version: "1.30.3+k0s.0"
    config:
      apiVersion: k0s.k0sproject.io/v1beta1
      kind: ClusterConfig
```

### 4.3 Apply the Configuration

Apply the configuration to deploy the k0s cluster on both nodes:

```bash
k0sctl apply --config k0sctl.yaml
```

This will deploy the k0s cluster on both nodes.

---

## Step 5: Configure the Cluster

### 5.1 Remove Taints to Enable Workloads on Controllers

To allow workloads to run on both controller nodes, remove the default taint:

```bash
kubectl taint nodes master-01.example.com node-role.kubernetes.io/master:NoSchedule-
kubectl taint nodes worker-01.example.com node-role.kubernetes.io/master:NoSchedule-
```

### 5.2 Verify Node and Pod Status

1. **Check Node Status**:
   ```bash
   kubectl get nodes
   ```

2. **Verify Pod

**Deployment**:
Deploy a simple test application to ensure everything is functioning.
You can test the deployment by creating an Nginx deployment:

1. **Create Nginx Deployment YAML**:
    ```bash
    cat <<EOF > nginx-deployment.yaml
    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: nginx-service
    spec:
      type: NodePort
      ports:
        - port: 80
          targetPort: 80
          nodePort: 30000
      selector:
        app: nginx
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
      labels:
        app: nginx
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
            - name: nginx
              image: nginx:1.27
              ports:
                - containerPort: 80
              resources:
                requests:
                  memory: "64Mi"
                  cpu: "250m"
                limits:
                  memory: "128Mi"
                  cpu: "500m"
              readinessProbe:
                httpGet:
                  path: /
                  port: 80
                initialDelaySeconds: 5
                periodSeconds: 10
              livenessProbe:
                httpGet:
                  path: /
                  port: 80
                initialDelaySeconds: 15
                periodSeconds: 20
    EOF
    ```

2. **Apply the YAML File**:
    ```bash
    kubectl apply -f nginx-deployment.yaml
    ```

3. **Access the Nginx Service**:
   Open your browser and navigate to `http://worker-01.example.com:30000/`.

Access the application by using the NodePort assigned to the nginx service.

### 5.3 Configure kubectl Access

Export the kubeconfig file to access the cluster:

```bash
k0sctl kubeconfig > kubeconfig
export KUBECONFIG=$PWD/kubeconfig
```

To make this permanent, add the export command to your `.zshrc` or `.bashrc` file.

---

# Reverse Proxy Gateway Setup with Wireguard VPN

**Setting Up a WireGuard VPN on Debian (Cloud VM) and AlmaLinux (Local Machines: `master-01` and `worker-01`)**

This guide provides detailed instructions for setting up a WireGuard VPN between a remote AlmaLinux 9 server (
`cloud-vm`) and two AlmaLinux 9 client nodes (`master-01` and `worker-01`). The guide covers installation,
configuration, and optional routing of client traffic through the VPN server.

### Step 1: Set Up WireGuard on the Remote Server (`cloud-vm`)

#### 1.1 Install WireGuard

First, log into your Debian 12 server and install WireGuard using the `apt` package manager. Root access is required, so
either switch to the root user or prepend the commands with `sudo`.

Login as root: `su -` otherwise use sudo everywhere to run following command:

```bash
dnf update && dnf upgrade -y
dnf install epel-release -y
dnf install wireguard-tools -y
```

#### 1.2 Generate Server Keys on the Cloud VM

Generate the server's private and public keys. For each VPN interface, create separate key pairs.

```bash
wg genkey | tee /etc/wireguard/privatekey.cloud-vm-wg0 | wg pubkey | tee /etc/wireguard/publickey.cloud-vm-wg0
chmod 400 /etc/wireguard/privatekey.cloud-vm-wg0
```

#### 1.3 Create WireGuard Configuration Files

Create and edit the WireGuard configuration files for both interfaces:

```bash
sudo nano /etc/wireguard/wg0.conf
```

Add the following configuration for `wg0`:

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <privatekey.cloud-vm-wg0>

#### IP forwarding rules
#PostUp = iptables -t nat -I POSTROUTING -o eth0 -j MASQUERADE
#PostUp = iptables -A FORWARD -i %i -j ACCEPT
#PostUp = iptables -A FORWARD -o %i -j ACCEPT
#PreDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
#PreDown = iptables -D FORWARD -i %i -j ACCEPT
#PreDown = iptables -D FORWARD -o %i -j ACCEPT

[Peer]
PublicKey = <publickey.master-01-wg0>
AllowedIPs = 10.0.0.2/32

[Peer]
PublicKey = <publickey.worker-01-wg0>
AllowedIPs = 10.0.0.3/32
```

**Note**: Replace `<privatekey.cloud-vm-wg0>`, `<privatekey.cloud-vm-wg0>`, `<publickey.master-01-wg0>`, and
`<publickey.worker-01-wg0>` with the actual keys you generated earlier.

#### 1.4 Configure Firewall on the Cloud VM

Allow the WireGuard ports through the firewall:

```bash
firewall-cmd --zone=public --permanent --add-port=51820/udp
firewall-cmd --permanent --zone=public --add-masquerade
firewall-cmd --reload
```

#### 1.6 Start and Enable WireGuard

Start and enable the WireGuard interfaces:

```bash
systemctl start wg-quick@wg0
systemctl enable wg-quick@wg0
```

---

### Step 2: Set Up WireGuard on the Clients (`master-01` and `worker-01`)

### 2.1 Install WireGuard

On each client, enable the Extra Packages for Enterprise Linux (EPEL) repository and install WireGuard:

Login as root via: `su -` otherwise use sudo everywhere to run following command:

```bash
dnf install epel-release -y
dnf install wireguard-tools -y
```

### 2.2 Generate Client Keys

**For `master-01`:**

```bash
wg genkey | tee /etc/wireguard/privatekey.master-01-wg0 | wg pubkey | tee /etc/wireguard/publickey.master-01-wg0
sudo chmod 400 /etc/wireguard/privatekey.master-01-wg0
```

**For `worker-01`:**

```bash
wg genkey | tee /etc/wireguard/privatekey.worker-01-wg0 | wg pubkey | tee /etc/wireguard/publickey.worker-01-wg0
chmod 400 /etc/wireguard/privatekey.worker-01-wg0
```

### 2.3 Configure Firewall

Allow the necessary WireGuard ports on the clients:

**For `master-01`:**

```bash
firewall-cmd --zone=public --permanent --add-port=51820/udp
firewall-cmd --reload
```

**For `worker-01`:**

```bash
firewall-cmd --zone=public --permanent --add-port=51820/udp
firewall-cmd --reload
```

### 2.4 Load WireGuard Kernel Module

Ensure the WireGuard kernel module is loaded on both clients:

```bash
modprobe wireguard
lsmod | grep wireguard
```

If the module is loaded, you should see output similar to:

```bash
wireguard             118784  0
ip6_udp_tunnel         16384  1 wireguard
udp_tunnel             28672  1 wireguard
curve25519_x86_64      36864  1 wireguard
libcurve25519_generic  49152  2 curve25519_x86_64,wireguard
```

### 2.5 Create WireGuard Configuration Files

**For `master-01`:**

Create and edit the configuration file:

```bash
nano /etc/wireguard/wg0.conf
```

Add the following configuration:

```ini
[Interface]
PrivateKey = <privatekey.master-01-wg0>
Address = 10.0.0.2/32

[Peer]
PublicKey = <publickey.cloud-vm-wg0>
Endpoint = <CLOUD-VM-IP>:51820
AllowedIPs = 10.0.0.1/32
PersistentKeepalive = 25
```

**For `worker-01`:**

Create and edit the configuration file:

```bash
nano /etc/wireguard/wg0.conf
```

Add the following configuration:

```ini
[Interface]
PrivateKey = <privatekey.worker-01-wg0>
Address = 10.0.0.3/32

[Peer]
PublicKey = <publickey.cloud-vm-wg0>
Endpoint = <CLOUD-VM-IP>:51821
AllowedIPs = 10.0.0.1/32
PersistentKeepalive = 25
```

**Note**: Replace `<privatekey.master-01-wg0>`, `<privatekey.worker-01-wg0>`, `<publickey.cloud-vm-wg0>`,
`<publickey.cloud-vm-wg0>`, and `<server-public-ip>` with your actual keys and the server’s public IP address.

### 2.6 Start and Enable WireGuard

Start and enable the WireGuard service on both clients:

```bash
systemctl start wg-quick@wg0
systemctl enable wg-quick@wg0
```

---

#### In case you would like to Redirect all the traffic from client to through the wireguard tunnel then follow following steps:

- Enable IP forwarding on the server by modifying the `sysctl` configuration:

```bash
sed -i 's/^# *net\.ipv4\.ip_forward = 1/net\.ipv4\.ip_forward = 1/' /etc/sysctl.conf
sysctl -p
```

- Change `AllowedIPs = 0.0.0.0/0` in wg0.conf and wg1.conf at the Clients Machine.

- And Uncomment the `IP forwarding rules` block for PreDown and PostUp configuration on the Cloud VM.

---

# Reverse Proxy Gateway Setup with NGINX

Currently used instructions at [4. nginx-setup.md](./4. nginx-setup.md).

---


(IGNORE BELOW THIS. JUST NOTES)

### Install Certbot and NGINX

Install Certbot for obtaining SSL certificates and NGINX for web serving:

```bash
apt install certbot python3-certbot-nginx
systemctl enable nginx
```

### Configure NGINX for Let's Encrypt

1. **Create Let's Encrypt Configuration**:
   ```bash
   touch /etc/nginx/snippets/letsencrypt.conf
   echo "location ^~ /.well-known/acme-challenge/ {
       default_type \"text/plain\";
       root /var/www/letsencrypt;
   }" > /etc/nginx/snippets/letsencrypt.conf
   ```

2. **Create the Directory**:
   ```bash
   mkdir /var/www/letsencrypt
   ```

3. **Configure NGINX for HTTP**:
   Create and edit the file `/etc/nginx/sites-enabled/kakde.eu`:

   ```bash
   touch /etc/nginx/sites-enabled/kakde.eu
   echo "server {
       listen 80;
       include /etc/nginx/snippets/letsencrypt.conf;
       server_name kakde.eu www.kakde.eu;
       root /var/www/kakde.eu;
       index index.html;
   }" > /etc/nginx/sites-enabled/kakde.eu
   ```

4. **Verify and Reload NGINX**:
   ```bash
   nginx -t
   systemctl reload nginx
   ```

### Fetch and Deploy SSL Certificate

1. **Obtain Certificate**:
   ```bash
   certbot --nginx -d kakde.eu -d www.kakde.eu
   ```

2. **Verify Configuration**:
   After obtaining the certificate, the `/etc/nginx/sites-enabled/kakde.eu` file will be updated automatically by
   Certbot.

3. **Enable Auto Renew**:
   Add the following lines to crontab (`crontab -e`) to renew certificates automatically:

   ```bash
   30 2 * * 1 /usr/bin/certbot renew >> /var/log/certbot_renew.log 2>&1
   35 2 * * 1 /etc/init.d/nginx reload
   ```

### Redirect HTTP to HTTPS and Non-WWW to WWW

Edit the NGINX configuration to redirect all HTTP requests to HTTPS and non-WWW URLs to WWW:

```bash
mv /etc/nginx/sites-enabled/kakde.eu kakde.eu.initial.config
nano /etc/nginx/sites-enabled/kakde.eu
```

Replace the content with the following:

```nginx
# Redirect HTTP to HTTPS and non-WWW to WWW
server {
    listen 80;
    include /etc/nginx/snippets/letsencrypt.conf;
    server_name kakde.eu www.kakde.eu;
    location / {
        return 301 https://kakde.eu$request_uri;
    }
}

# HTTPS server for WWW redirect and upstream proxy
upstream backend {
    server 10.0.0.3:30000;  # worker-01
}

server {
    listen 443 ssl; 
    ssl_certificate /etc/letsencrypt/live/kakde.eu/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/kakde.eu/privkey.pem; 
    include /etc/letsencrypt/options-ssl-nginx.conf; 
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; 
    server_name kakde.eu;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---