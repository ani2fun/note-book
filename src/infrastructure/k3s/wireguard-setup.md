# 🔐 Setting Up WireGuard VPN

## Why Use WireGuard?

* **Security**: Encrypts communication between nodes across the public internet, preventing unauthorized access or interception. WireGuard uses state-of-the-art cryptography to secure tunnels.
* **Simplicity**: WireGuard is lightweight, fast, and easier to configure than alternatives (e.g. OpenVPN).
* **Performance**: It is built into modern Linux kernels and incurs minimal overhead.

## 1. Installing WireGuard

Install WireGuard on **all nodes**, using the appropriate package manager for each OS:

* **AlmaLinux (or RHEL/CentOS)**:

  ```bash
  sudo dnf install epel-release -y
  sudo dnf install wireguard-tools -y
  ```

  This pulls WireGuard from EPEL and installs the tools.

* **Debian Trixie (worker-01)**:
  Update APT and install from the official repositories:

  ```bash
  sudo apt update 
  sudo apt install wireguard -y
  ```

  Debian 12/13 (Trixie) include WireGuard in their main repos. This installs the `wireguard` metapackage (which brings in `wireguard-tools` and any dependencies).

After installation, **load the WireGuard kernel module** (if not already active):

  ```bash
  sudo modprobe wireguard
  lsmod | grep wireguard
  ```

Modern kernels (≥5.6) include WireGuard support by default, but `modprobe` ensures it’s loaded. If successful, `lsmod` should list **wireguard** and related modules (see example in original doc).

## 2. Generating WireGuard Keys

Each node needs a unique WireGuard key pair. Run the following **on each node** (adjusting `<node>` to `master-01`, `worker-01`, or `cloud-vm` as appropriate):

  ```bash
  wg genkey | sudo tee /etc/wireguard/privatekey.<node>-wg0
  sudo chmod 400 /etc/wireguard/privatekey.<node>-wg0
  sudo cat /etc/wireguard/privatekey.<node>-wg0 | wg pubkey | sudo tee /etc/wireguard/publickey.<node>-wg0
  ```

* The first command generates a private key and saves it (for example, to `/etc/wireguard/privatekey.worker-01-wg0`).
* `chmod 400` restricts access so only root can read the private key.
* The last command reads the private key and generates the corresponding public key (saved to `/etc/wireguard/publickey.<node>-wg0`).

This process ensures each node has a **private/public key pair** for secure communication. (Alternatively, you can use `umask 0077 && wg genkey | tee ...` in `/etc/wireguard` to automatically protect the key, but the above `sudo tee` approach works on both Alma and Debian.)

## 3. Configuring WireGuard

Create `/etc/wireguard/wg0.conf` on each node, defining its interface and peers. The **IP addressing** below uses only IPv4 (no IPv6). Adjust `<...>` placeholders to your actual keys and IPs.

### Master-01 (e.g. 10.0.0.1)

  ```ini
  [Interface]
  PrivateKey = <MASTER_01_PRIVATE_KEY>
  Address = 10.0.0.1/24   # Master’s WireGuard VPN IP
  ListenPort = 51820      # WireGuard UDP port
  
  # Peer: cloud-vm
  [Peer]
  PublicKey = <CLOUD_VM_PUBLIC_KEY>
  Endpoint = <CLOUD_VM_PUBLIC_IP>:51820   # Cloud VM’s public endpoint
  AllowedIPs = 10.0.2.0/24                # Route to 10.0.2.x subnet
  PersistentKeepalive = 25                # Maintain NAT mapping
  
  # Peer: worker-01
  [Peer]
  PublicKey = <WORKER_01_PUBLIC_KEY>
  Endpoint = 192.168.5.3:51820           # Worker-01’s local IP on LAN
  AllowedIPs = 10.0.1.0/24               # Route to 10.0.1.x subnet
  PersistentKeepalive = 25
  ```

### Worker-01 (Debian Trixie, e.g. 10.0.1.1)

  ```ini
  [Interface]
  PrivateKey = <WORKER_01_PRIVATE_KEY>
  Address = 10.0.1.1/24   # Worker’s WireGuard VPN IP
  ListenPort = 51820      # WireGuard UDP port
  
  # Peer: cloud-vm
  [Peer]
  PublicKey = <CLOUD_VM_PUBLIC_KEY>
  Endpoint = <CLOUD_VM_PUBLIC_IP>:51820  # Cloud VM’s public endpoint
  AllowedIPs = 10.0.2.0/24               # Route to 10.0.2.x subnet
  PersistentKeepalive = 25
  
  # Peer: master-01
  [Peer]
  PublicKey = <MASTER_01_PUBLIC_KEY>
  Endpoint = 192.168.15.2:51820          # Master-01’s local IP on LAN
  AllowedIPs = 10.0.0.0/24               # Route to 10.0.0.x subnet
  PersistentKeepalive = 25
  ```

*Note:* Since **worker-01 is behind a NAT (home router)**, ensure that your router forwards a port (e.g. UDP 52820) to worker-01’s port 51820.  Routers block incoming requests by default, so port forwarding is needed to allow the cloud-vm to reach worker-01. For example, forward external UDP port **52820** on your router to internal port **51820** of worker-01’s LAN IP. Also, the `PersistentKeepalive = 25` on each peer means each node will send a small packet every 25s, which is *essential* for peers behind NAT to keep the connection active.

### Cloud-vm (e.g. 10.0.2.1)

  ```ini
  [Interface]
  PrivateKey = <CLOUD_VM_PRIVATE_KEY>
  Address = 10.0.2.1/24   # Cloud VM’s WireGuard VPN IP
  ListenPort = 51820      # WireGuard UDP port
  
  # Peer: master-01
  [Peer]
  PublicKey = <MASTER_01_PUBLIC_KEY>
  Endpoint = <ROUTER_PUBLIC_IP>:51820   # Router’s public IP (forwarded to Master-01)
  AllowedIPs = 10.0.0.0/24             # Route to 10.0.0.x subnet
  PersistentKeepalive = 25
  
  # Peer: worker-01
  [Peer]
  PublicKey = <WORKER_01_PUBLIC_KEY>
  Endpoint = <ROUTER_PUBLIC_IP>:52820   # Router’s public IP (forwarded to Worker-01)
  AllowedIPs = 10.0.1.0/24             # Route to 10.0.1.x subnet
  PersistentKeepalive = 25
  ```

### Configuration Notes

* **Address**: The `Address` line under `[Interface]` sets the node’s VPN IP (e.g. `10.0.1.1/24`). We are using only **IPv4** addresses here (no IPv6).
* **ListenPort**: All nodes listen on UDP port 51820 by default (adjust if needed).
* **PublicKey/PrivateKey**: Replace `<..._PRIVATE_KEY>` and `<..._PUBLIC_KEY>` with the actual keys generated earlier (without whitespace).
* **Endpoint**: For each peer, `Endpoint` is the public IP (and port) where that peer can be reached. Home nodes behind NAT use their *internal* LAN IPs in each other’s config, but the cloud-vm uses the router’s public IP with appropriate port forwarding.
* **AllowedIPs**: Restricts traffic to those subnets. For example, master-01’s config allows `10.0.2.0/24` (cloud-vm subnet) through the tunnel.
* **PersistentKeepalive**: Set to 25s on both sides of a connection if **either peer is behind NAT**. This ensures the NAT mapping stays alive so incoming packets from the peer can traverse the NAT/firewall.

## 4. Enabling IP Forwarding

On **all nodes**, enable IPv4 forwarding so that the system can route traffic between peers (necessary for mesh or relayed traffic):

  ```bash
  echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

This writes the setting to `/etc/sysctl.conf` and then applies it. It allows the kernel to forward packets, which is critical for cross-subnet VPN routing.

## 5. Starting WireGuard

Start the WireGuard interface and enable it to come up on boot on **all nodes**:

  ```bash
  sudo systemctl start wg-quick@wg0
  sudo systemctl enable wg-quick@wg0
  ```

This uses `wg-quick` to bring up the `wg0` interface with the above config. Enabling it on boot ensures the VPN persists across reboots. Check with `sudo systemctl status wg-quick@wg0` that the service is active.

## 6. Verifying the VPN Mesh

* **Check status/handshake:** On each node, run:

  ```bash
  sudo wg show
  ```

  This will display each peer and the *latest handshake* time. A recent handshake timestamp indicates the tunnel is up. (If there is no handshake or very old, check connectivity and settings.) Checking `wg show` is a good first step in troubleshooting: if the handshake is present but traffic fails, IP forwarding or firewall rules might be the issue.

* **Firewall/ICMP:** Ensure the VPN UDP port (51820) is allowed through any host firewall. For example, on Debian/Ubuntu with UFW enabled:

  ```bash
  sudo ufw allow 51820/udp
  ```

  On systems using `firewalld` (e.g. AlmaLinux), ensure UDP 51820 is permitted in the **trusted** zone. Also, ping (ICMP) should be allowed if you want to use `ping` to test connectivity. On AlmaLinux one might remove ICMP blocking rules:

  ```bash
  sudo firewall-cmd --permanent --zone=trusted --remove-icmp-block=echo-reply
  sudo firewall-cmd --permanent --zone=trusted --remove-icmp-block=echo-request
  sudo firewall-cmd --reload
  ```

  On Debian with UFW, ICMP is usually allowed by default.

* **Ping tests:** SSH into each node and test connectivity over the VPN:

  * From **cloud-vm**:

    ```bash
    ping 10.0.0.1 -c 4   # master-01
    ping 10.0.1.1 -c 4   # worker-01
    ```

  * From **master-01**:

    ```bash
    ping 10.0.1.1 -c 4   # worker-01
    ping 10.0.2.1 -c 4   # cloud-vm
    ```

  * From **worker-01**:

    ```bash
    ping 10.0.0.1 -c 4   # master-01
    ping 10.0.2.1 -c 4   # cloud-vm
    ```

  Successful pings (0% packet loss) confirm that each node can reach the others through the WireGuard tunnel.

## Troubleshooting

* **Debug logging:** For more detailed output, enable the kernel module’s dynamic debugging (if using the kernel implementation). For example:

  ```bash
  sudo modprobe wireguard
  echo 'module wireguard +p' | sudo tee /sys/kernel/debug/dynamic_debug/control
  ```

  This turns on verbose logging for WireGuard in the kernel. (To disable it later, use `-p` instead of `+p`.) This method follows the official WireGuard quickstart. Logs will appear in `dmesg` or `sudo journalctl -k`.

* **Check `wg show`:** If `wg show` shows a latest handshake but traffic still fails, double-check **IP forwarding** (it must be enabled) and firewall rules. A common issue is forgetting `net.ipv4.ip_forward=1`, which blocks traffic between subnets.

* **Routing and MTU:** WireGuard usually auto-sets MTU based on interface. If you encounter MTU issues, you can manually set the `MTU` (e.g. 1420) under the `[Interface]` in the config.

* **Port forwarding (NAT):** Ensure your home router’s port forwarding is correctly configured for worker-01, and that the **Endpoint** IPs/ports in the configs match the public IP/ports you forwarded. Remember that only the side *receiving* connections needs port forwarding – for example, if worker-01 never accepts incoming connections from the internet (only initiates to cloud-vm), you may not need to forward.

With all these steps, the WireGuard VPN mesh should be fully operational. Each node should now communicate securely over the encrypted 10.0.x.x network.

**Sources:** Official WireGuard and Debian documentation and guides were used to confirm installation commands, configuration best practices (especially for NAT and keepalives), and enabling debug logging. The Debian Wiki in particular notes that installing the `wireguard` package automatically pulls in the necessary tools, and that IP forwarding must be enabled in `/etc/sysctl.conf`. The WireGuard QuickStart confirms the use of `PersistentKeepalive = 25` for peers behind NAT and shows how to enable kernel debug logs. All instructions above integrate these best practices for Debian (Trixie) and AlmaLinux systems.
