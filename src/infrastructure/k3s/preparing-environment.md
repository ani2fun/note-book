# Preparing the Cluster Environment

Before building the cluster, we **prepare each node** to ensure it’s up-to-date, uniquely named, securely accessible, and can communicate over the network. This avoids configuration conflicts and security issues later. For example, applying updates promptly is critical: “it is of utmost importance to apply security patches and updates regularly to protect systems against vulnerabilities or potential exploits”. Similarly, giving each node a unique hostname prevents confusion in logs and networking. In short, this preparation lays a stable, secure foundation for Kubernetes.

## 1. Launch and Configure the AWS EC2 Instance

* **Login & Launch** – In the AWS Console, go to EC2 and launch a new instance. Choose an AMI (e.g. **Amazon Linux 2023**, free-tier) or another compatible OS (AlmaLinux for RHEL-like behavior). Select **t2.micro** (or larger) as the instance type. Create or select an SSH key pair (e.g. `ec2-key.pem`) for secure login. Use the default VPC and **enable Auto-assign Public IP** so the instance is reachable from the Internet. Allocate storage (e.g. **30 GiB gp3**). Tag the instance (e.g. `Name = cloud-vm.kakde.eu`) for easy identification.

* **Security Group** – Create or attach a security group (e.g. `ec2-cloud-vm-sg`) with these rules:

  * *Inbound:* SSH (TCP 22) **only** from your home IP (for secure SSH); UDP 51820 (WireGuard) only from your home IP; HTTP (TCP 80) and HTTPS (TCP 443) from anywhere (`0.0.0.0/0`) so web traffic can reach it.
  * *Outbound:* Allow all (default) so the instance can download packages, updates, etc.

* **User Data (optional)** – On launch, you can add a script under **Advanced Details → User data** to auto-install and start a web server. For example:

  ```bash
  #!/bin/bash
  yum update -y
  yum install -y httpd
  systemctl enable --now httpd
  echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html
  ```

  After the instance is running, browsing to `http://<public-ip>/` should show “Hello World from *cloud-vm.kakde.eu*”, confirming SSH and HTTP work.

* **(Worker-01 note)** – If `worker-01` is also an AWS instance, repeat these steps: tag it as `worker-01.kakde.eu` and configure its security group similarly (adjust the port forwarding below as needed). If `worker-01` is on a local network, just ensure it has a machine set up with equivalent connectivity (see steps below).

## 2. Updating System Packages

On **every node** (`master-01`, `worker-01`, `worker-02` and `cloud-vm`), update all packages and install networking tools. For example (use `dnf` on Amazon/Alma/CentOS or `apt` on Debian/Ubuntu):

```bash
sudo dnf update -y && sudo dnf upgrade -y
sudo dnf install -y net-tools
```

Keeping software up-to-date is crucial: unpatched systems are vulnerable to exploits. As one security guide notes, “apply security patches and updates regularly to protect systems against vulnerabilities or potential exploits”. The `net-tools` package (providing `ifconfig`, etc.) is helpful for troubleshooting network issues.

## 3. Setting Hostnames

Give each node a unique hostname so that they’re easily identifiable. Run on each machine:

* On **master-01**:

  ```bash
  sudo hostnamectl set-hostname master-01.kakde.eu
  sudo systemctl restart systemd-hostnamed
  ```
* On **worker-01**:

  ```bash
  sudo hostnamectl set-hostname worker-01.kakde.eu
  sudo systemctl restart systemd-hostnamed
  ```
* On **worker-02**:

  ```bash
  sudo hostnamectl set-hostname worker-02.kakde.eu
  sudo systemctl restart systemd-hostnamed
  ```

* On **cloud-vm**:

  ```bash
  sudo hostnamectl set-hostname cloud-vm.kakde.eu
  sudo systemctl restart systemd-hostnamed
  ```

Unique hostnames ensure logs and `kubectl` outputs clearly show which node is which.

## 4. Configuring SSH Access

**4.1 Generate SSH keys on master-01/worker-01/worker-02:** If not already done, on each of the local nodes generate an SSH key pair, e.g.:

```bash
sudo ssh-keygen -t ed25519 -C "user@master-01.kakde.eu"
```

Do the same on other nodes (adjust the comment accordingly). Then, copy your jumpbox or management machine’s public key (`~/.ssh/id_ed25519.pub`) into `~/.ssh/authorized_keys` on each node (`master-01`, `worker-01`, and `cloud-vm`). This enables **key-based, passwordless SSH** logins, which are more secure and convenient than passwords. *(Optionally*, if you **must** allow root SSH, edit `/etc/ssh/sshd_config` on those nodes and set `PermitRootLogin yes`, then `sudo systemctl restart sshd`.)

**4.2 SSH into the EC2 (cloud) VM:** From your jumpbox or local terminal, connect to the AWS instance using the `.pem` key. For example:

```bash
ssh -i ec2-key.pem ec2-user@<CLOUD_VM_PUBLIC_IP>
```

*(On Amazon Linux, the default user is `ec2-user`.)*

## 5. SELinux and Other Linux Security Modules

If your nodes run a RHEL/CentOS-based distro (Amazon Linux, AlmaLinux, etc.), SELinux is usually present. Kubernetes often recommends setting SELinux to **permissive** during setup to avoid blocking components. For example, on **master-01** and **cloud-vm** (RHEL-based nodes), do:

```bash
sudo sed -i 's/SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
sudo reboot
```

This change makes SELinux log policy violations instead of enforcing them immediately. Most docs suggest permissive mode during setup; later you can develop proper SELinux policies if needed.

**Why SELinux matters:** SELinux (Security-Enhanced Linux) is a *Mandatory Access Control* system that enforces fine-grained permissions. It operates on the principle of least privilege, so “only necessary permissions are granted, thereby minimizing potential attack vectors”. In fact, enterprise environments (government, telecom, etc.) often **require** SELinux or equivalent controls to meet security standards. Red Hat explicitly recommends enabling SELinux on all RHEL-based instances (in dev, test, and production), because its “robust mandatory access control” is “invaluable” for protecting critical assets.

**Debian/Ubuntu nodes:** Debian does not enable SELinux by default; its kernels have SELinux support compiled in but disabled. Instead, Debian-based systems typically use **AppArmor** (path-based MAC) by default. AppArmor is easier to manage but less granular than SELinux. If your `worker-01` is Debian/Ubuntu, you won’t configure SELinux; instead, ensure some security modules are active (e.g. ensure AppArmor profiles are enforcing, or use Docker/Audit/filers, etc.). Whether using SELinux or AppArmor, the goal is the same: restrict processes so even if one is compromised, it can’t easily affect others. In short, SELinux is common on RHEL, while Debian admins often rely on AppArmor or other isolation (and a strong firewall).

## 6. Router Networking Setup (Home Network)

In this hybrid setup, the `cloud-vm` in AWS must reach `master-01`, `worker-01` and `worker-02` on your home LAN via a VPN (WireGuard) over the Internet. Because your home router does NAT, configure **port forwarding** on it:

* Forward **UDP 51820** (WireGuard) from your router’s public IP to `192.168.1.10:51820` (master-01).
* Forward **UDP 52820** from your router’s public IP to `192.168.1.11:51820` (worker-01).

For example, if your router’s public IP is `203.0.113.1`, set:

```
203.0.113.1:51820  →  192.168.15.2:51820  (master-01 WireGuard)
203.0.113.1:52820  →  192.168.15.3:51820  (worker-01 WireGuard)
203.0.113.1:53820  →  192.168.15.4:51820  (worker-02 WireGuard)
```

Using different external ports (51820 vs 52820) tells the router which internal node to reach. This ensures incoming VPN packets from the cloud VM can get to the correct home node. Without this NAT rule, the cloud VM could not initiate connections to the home servers.

## 7. Firewall Configuration (Firewalld/UFW)

Finally, configure the host firewall on each node so only necessary ports are open. The recommended setup uses **firewalld** with zones:

* **Trusted zone (internal/VPN):** On *all nodes*, run:

  ```bash
  sudo firewall-cmd --permanent --zone=trusted --add-port=51820/udp   # WireGuard VPN
  sudo firewall-cmd --permanent --zone=trusted --add-port=80/tcp      # HTTP (services)
  sudo firewall-cmd --permanent --zone=trusted --add-port=443/tcp     # HTTPS (services)
  sudo firewall-cmd --permanent --zone=trusted --add-port=6443/tcp    # Kubernetes API
  sudo firewall-cmd --permanent --zone=trusted --add-port=10250-10257/tcp  # Kubelet, metrics
  sudo firewall-cmd --permanent --zone=trusted --add-port=30000-32767/tcp  # NodePort range
  sudo firewall-cmd --permanent --zone=trusted --add-source=10.0.0.0/16    # WireGuard VPN subnet
  sudo firewall-cmd --permanent --zone=trusted --add-source=10.43.0.0/16   # Kubernetes service subnet
  sudo firewall-cmd --permanent --zone=trusted --add-source=172.16.0.0/12 # Pod network (Calico)
  sudo firewall-cmd --reload
  ```

  These rules allow cluster-internal traffic (API calls, pod/service networks) and the VPN port *only* on the trusted side. (Masquerading is enabled in the public zone below.)

* **Public zone (external):** On the *cloud-vm* (and optionally on others if needed), run:

  ```bash
  sudo firewall-cmd --permanent --zone=public --add-port=51820/udp  # Allow incoming VPN
  sudo firewall-cmd --permanent --zone=public --add-port=80/tcp     # HTTP (if cloud VM serves web)
  sudo firewall-cmd --permanent --zone=public --add-port=443/tcp    # HTTPS (if needed)
  sudo firewall-cmd --permanent --zone=public --add-service=ssh     # Allow SSH
  sudo firewall-cmd --permanent --zone=public --add-service=wireguard  # Allow WireGuard (on some systems)
  sudo firewall-cmd --permanent --zone=public --add-service=dns     # (if DNS service needed)
  sudo firewall-cmd --permanent --zone=public --add-masquerade     # Enable NAT for outbound
  sudo firewall-cmd --reload
  ```

  These rules let external clients (the Internet) reach SSH and WireGuard on the cloud VM, and enable masquerading so pods can reach the Internet properly. The difference in zones ensures that only trusted traffic can hit the Kubernetes control ports (6443, kubelet ports, etc.).

*Debian note:* Debian’s default firewall framework is **nftables** (replacing iptables). Its wiki even suggests using firewalld as a convenient wrapper for nftables. In practice, many Debian/Ubuntu admins prefer **UFW** for simplicity. UFW is not installed by default on Debian, but you can install and use it. For example, equivalent rules in UFW would be: `sudo ufw allow 51820/udp`, `sudo ufw allow 6443/tcp`, and `sudo ufw allow from 10.0.0.0/16` (for the VPN subnet), etc. In summary, whether via firewalld or UFW, ensure only the needed ports/subnets are permitted.

By following these steps—with updates, secure SSH, a consistent naming scheme, a permissive SELinux or equivalent, proper NAT/VPN setup, and strict firewalls—you create a robust environment ready for installing and joining Kubernetes components.

**Sources:** The recommendations above follow Linux and Kubernetes best practices. For example, applying system updates is emphasized by security guidelines, SELinux is documented as a key MAC system (used by default in RHEL/CentOS), while Debian/Ubuntu use AppArmor instead. Debian’s nftables/firewalld preference is noted in its documentation, and using UFW on Debian is a common simplification. These measures collectively secure and prepare each node for the cluster.
