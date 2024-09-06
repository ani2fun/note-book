## **🛠️ **Preparing Environment****

---

### **📦 **1. Updating System Packages****

- Before proceeding, update the system packages on all nodes:

  ```bash
  sudo dnf update && sudo dnf upgrade -y
  sudo dnf install net-tools -y
  ```

---

### **🏷️ **2. Setting Hostnames****

- Set the hostname for each node:

  ```bash
  sudo hostnamectl set-hostname master-01.example.com
  sudo hostnamectl set-hostname worker-01.example.com
  sudo hostnamectl set-hostname cloud-vm.example.com
  ```

- Restart the hostname service to apply changes:

  ```bash
  sudo systemctl restart systemd-hostnamed
  ```

---

### **🔑 **3. Configuring SSH Access****

- Generate SSH keys on each node (if not already generated).

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

---

### **🛡️ **4. Configuring SELinux****

- Most documentation recommends setting SELinux to permissive or disabling it until all security policy concerns are
  addressed.
- Edit the SELinux configuration file: `vi /etc/selinux/config` and set `SELINUX=permissive` or `SELINUX=disabled`.
- If you modify the SELinux settings, reboot the system for the changes to take effect.

---

### **🌐 **5. Router Networking Setup****

As Currently this is hybrid environment, where cloud-vm is VPS hosted in the Contabo cloud VPS server and my local home
network, we need to take of certain networking scenarios. Local Home network is served with router of my internet
provider. So it has different public ip assigned. Behind this router on my home network is created. The private ip
addresses is assigned by my router. Better to assign static ip address for the machine master-01 and worker-01.

- Do **UDP** port forwarding from router ip port **51820** to machine's port **51820** for master-01 node for wireguard.
- Do **UDP** port forwarding from router ip port **52820** to machine's port **51820** for worker-01 node for wireguard.
- For example, if your Public IP address of router is: <ROUTER_PUBLIC_IP>, then open up different port and forward it to
  correct machines.
    - <ROUTER_PUBLIC_IP>:**51820** forwarded to <PRIVATE_IP_MASTER_01>:51820
    - <ROUTER_PUBLIC_IP>:**52820** forwarded to <PRIVATE_IP_WORKER_01>:51820

---

### **🔥 **6. Setting Up Firewall Rules****

To ensure secure and proper communication between the nodes, configure the firewall on each node. Some of the rules may
not be needed please adjust as per your requirements.

Zone info: https://firewalld.org/documentation/zone/predefined-zones.html

- **Public Zone:** This zone is for public-facing services and ports. Masquerading is enabled to ensure proper network
  address translation (NAT), which is essential for routing traffic from private to public networks.
- **Trusted Zone:** This zone is for internal communication between trusted networks, such as your VPN and Kubernetes
  pod and service networks. It ensures that the necessary traffic can flow freely between nodes.

**Please configure it as per your need.**

---

- **Trusted Zone Configuration:**
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

- **Public Zone Configuration:**
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