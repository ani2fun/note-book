## **🛠️ **Preparing Environment****

---

### Why Prepare the Environment?
Preparation ensures all nodes are updated, uniquely identifiable, securely accessible, and configured to allow cluster communication. This step prevents compatibility issues, simplifies management, and secures the foundation of your cluster.

---

## 1: Launch and Configure the AWS EC2 Instance
### 1.1 Launch the Instance

- Log in to AWS Management Console and go to the EC2 dashboard.
- Launch a new EC2 instance:
  - AMI: Use Amazon Linux 2023 (Free tier eligible) (or match your existing setup, e.g., AlmaLinux). 
  - Instance Type: Choose t2.micro or adjust as needed. 
  - Key Pair: Select or create a key pair (e.g., ec2-key.pem) for SSH. 
  - Network: Use the default VPC and enable Auto-assign Public IP. 
  - Storage: Allocate a root volume (e.g., 30 GiB gp3). 
  - Tags: Add a tag (e.g., Name: ec2-cloud-vm).

### 1.2 Set Up Security Group

- Create a security group (e.g., ec2-cloud-vm-sg):
  - Inbound Rules:
    - SSH (TCP 22): Restrict to your IP (e.g. Home router’s public IP). 
    - WireGuard (UDP 51820): Allow from your home router’s public IP. 
    - HTTP (TCP 80): Allow from 0.0.0.0/0.
    - HTTPS (TCP 443): Allow from 0.0.0.0/0.
  - Outbound Rules: Allow all traffic.

- Attach the security group to the EC2 instance.

### 1.3 Add some user data to test your AWS instance when starting it first time (optional):

- Under **User data - optional** field add this config:
```bash
#!/bin/bash
# Use this for your user data (script from top to bottom)
# install httpd (Linux 2 version)
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
echo "<h1>Hello World from $(hostname -f) </h1>" > /var/www/html/index.html
```

- After EC2 instance being launched check for the running Hello world with automatically assigned public ip via web-browser. . e.g. `http://12.35.34.89`

### 


### 📦 2. Updating System Packages

- **Command** (run on all nodes: `master-01`, `worker-01`, `cloud-vm`):
  ```bash
  sudo dnf update && sudo dnf upgrade -y
  sudo dnf install net-tools -y
  ```
- **Why**: Updates ensure the latest security patches and software versions, reducing vulnerabilities. `net-tools` provides utilities like `ifconfig` for network troubleshooting.

---

### 🏷️ 3. Setting Hostnames

- **Commands**:
  - On `master-01`:
    ```bash
    sudo hostnamectl set-hostname master-01.kakde.eu
    sudo systemctl restart systemd-hostnamed
    ```
  - On `worker-01`:
    ```bash
    sudo hostnamectl set-hostname worker-01.kakde.eu
    sudo systemctl restart systemd-hostnamed
    ```
  - On `cloud-vm`:
    ```bash
    sudo hostnamectl set-hostname cloud-vm.kakde.eu
    sudo systemctl restart systemd-hostnamed
    ```
- **Why**: Unique hostnames make nodes easily identifiable in logs, `kubectl` outputs, and network configurations. Restarting `systemd-hostnamed` applies the change immediately.

---

### 🔑 4. Configuring SSH Access

### 4.1 SSH keys for master-01 and worker-01 node.
- Generate SSH keys on node master-01 and worker-01 (if not already generated).

  ```bash
  sudo ssh-keygen -t ed25519 -C "<user-name>@<node-name>"
  ```

- Copy your Jumpbox's public key e.g. `~/.ssh/id_ed25519.pub"` to the authorized keys `~/.ssh/authorized_keys` file on
  the remote nodes to enable passwordless SSH access. This will ease your access to machines from your jumpbox machine
  for ssh access:

- (Optional) If you want to enable a root access then:
    - Edit the SSH configuration file: `nano /etc/ssh/sshd_config`
    - Set `PermitRootLogin` to `yes` and restart the SSH service.
    - Restart sshd : `systemctl restart sshd`

- **Why**: Passwordless SSH with key-based authentication simplifies remote management and automation. `ed25519` is a secure, modern key type.

### 4.2 SSH into the EC2 instance:
```bash
ssh -i ec2-key.pem ec2-user@<EC2_PUBLIC_IP>
```

**ec2-user** is the default user when you create EC2 Instance from 

---

### 🛡️ 5. Configuring SELinux

- **Action**: Edit `/etc/selinux/config` on all nodes and set `SELINUX=permissive`, then reboot for changes for the changes to take effect:
  ```bash
  sudo sed -i 's/SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
  sudo reboot
  ```
- **Why**: SELinux in enforcing mode can block Kubernetes components due to strict permissions. Setting it to permissive logs violations without blocking, easing setup. Most documentation recommends setting SELinux to permissive or disabling it until all security policy concerns are
  addressed.

---

### 🌐 6. Router Networking Setup

As Currently this is hybrid environment, where cloud-vm is VPS hosted in the Contabo cloud VPS server and my local home
network, we need to take of certain networking scenarios. Local Home network is served with router of my internet
provider. So it has different public ip assigned. Behind this router on my home network is created. The private ip
addresses is assigned by my router. Better to assign static ip address for the machine master-01 and worker-01.

- **Action**: Configure port forwarding on your home router:
  - Forward external UDP port `51820` to `192.168.1.10:51820` (master-01).
  - Forward external UDP port `52820` to `192.168.1.11:51820` (worker-01).
- For example, if your Public IP address of router is: <ROUTER_PUBLIC_IP>, then open up different port and forward it to
  correct machines.
    - <ROUTER_PUBLIC_IP>:**51820** forwarded to <PRIVATE_IP_MASTER_01>:51820
    - <ROUTER_PUBLIC_IP>:**52820** forwarded to <PRIVATE_IP_WORKER_01>:51820
- **Why**: Allows WireGuard VPN traffic from the cloud VM to reach home nodes. Different external ports (`51820` and `52820`) distinguish traffic to each home node behind NAT.
- **Example**: If your router’s public IP is `203.0.113.1`, forward `203.0.113.1:51820` → `192.168.1.10:51820`.
---

### 🔥 6. Setting Up Firewall Rules

To ensure secure and proper communication between the nodes, configure the firewall on each node. Some of the rules may
not be needed please adjust as per your requirements.

Zone info: https://firewalld.org/documentation/zone/predefined-zones.html

- **Public Zone:** This zone is for public-facing services and ports. Masquerading is enabled to ensure proper network
  address translation (NAT), which is essential for routing traffic from private to public networks.
- **Trusted Zone:** This zone is for internal communication between trusted networks, such as your VPN and Kubernetes
  pod and service networks. It ensures that the necessary traffic can flow freely between nodes.

**Please configure it as per your need.**

---

- **Why**: Firewall rules control traffic for security and ensure cluster communication (e.g., Kubernetes API, VPN, and service ports).
- **Commands** (run on all nodes):

**Trusted Zone Configuration:**
```bash
# Ports
sudo firewall-cmd --zone=trusted --permanent --add-port=51820/udp # Add WireGuard VPN port on all nodes.
sudo firewall-cmd --zone=trusted --permanent --add-port=80/tcp # For HTTP external traffic
sudo firewall-cmd --zone=trusted --permanent --add-port=443/tcp # For HTTPS external traffic
sudo firewall-cmd --zone=trusted --permanent --add-port=6443/tcp # Add Kubernetes API server port
sudo firewall-cmd --zone=trusted --permanent --add-port=10250-10257/tcp # Add ports for Kubelet and metrics server communication
sudo firewall-cmd --zone=trusted --permanent --add-port=30000-32767/tcp # Add NodePort range for Kubernetes services
# sudo firewall-cmd --zone=trusted --permanent --add-port=2379-2380/tcp # If etcd used

# Add specific subnet under trusted for internal communication requirements
sudo firewall-cmd --zone=trusted --permanent --add-source=10.0.0.0/16 # Allow traffic from WireGuard VPN network
sudo firewall-cmd --zone=trusted --permanent --add-source=10.43.0.0/16 # Allow traffic from the Service network
sudo firewall-cmd --zone=trusted --permanent --add-source=172.16.0.0/12 # Allow traffic from the Pod network (adjust CIDR if needed for Calico CNI)

# Reload firewall to apply changes
sudo firewall-cmd --reload
```
---

**Public Zone Configuration:**
```bash
# Ports
sudo firewall-cmd --zone=public --permanent --add-port=51820/udp # Add WireGuard VPN port on all nodes.
sudo firewall-cmd --zone=public --permanent --add-port=80/tcp # For HTTP external traffic (Required only for cloud-vm).
sudo firewall-cmd --zone=public --permanent --add-port=443/tcp # For HTTPS external traffic (Required only for cloud-vm).
#sudo firewall-cmd --zone=public --permanent --add-port=6443/tcp # Add Kubernetes API server port (if required).
#sudo firewall-cmd --zone=public --permanent --add-port=10250-10257/tcp # Add ports for Kubelet and metrics server communication (if required).
#sudo firewall-cmd --zone=public --permanent --add-port=30000-32767/tcp # Add NodePort range for Kubernetes services (if required).
 
# Services
sudo firewall-cmd --zone=public --permanent --add-service=ssh # Allow SSH access.
sudo firewall-cmd --zone=public --permanent --add-service=wireguard # Allow WireGuard service.
sudo firewall-cmd --zone=public --permanent --add-service=dns # Allow DNS services (optional, adjust based on your needs).
  
# Enable masquerading for proper network address translation
sudo firewall-cmd --zone=public --permanent --add-masquerade
  
# Reload firewall to apply changes
sudo firewall-cmd --reload
```

---