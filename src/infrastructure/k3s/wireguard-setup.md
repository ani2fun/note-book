## **🔐 **Setting Up WireGuard VPN****

### Why Use WireGuard?
- **Security**: Encrypts communication between nodes across the public internet, preventing unauthorized access or interception.
- **Simplicity**: WireGuard is lightweight, fast, and easier to configure than alternatives like OpenVPN.

---

## **⚙️ **1. Installing WireGuard****

**Install WireGuard on all nodes:**

- using **dnf** or **yum** whichever suits your need:
  ```bash
  sudo dnf install epel-release -y
  sudo dnf install wireguard-tools -y
  ```

**Load WireGuard Kernel Module:**

- **Ensure the WireGuard kernel module is loaded on all nodes:**
    ```bash
    modprobe wireguard
    lsmod | grep wireguard
    ```

- **If the module is loaded, you should see output similar to:**
    ```console
    wireguard             118784  0
    ip6_udp_tunnel         16384  1 wireguard
    udp_tunnel             28672  1 wireguard
    curve25519_x86_64      36864  1 wireguard
    libcurve25519_generic  49152  2 curve25519_x86_64,wireguard
    ```

---

## **🔑 **2. Generating WireGuard Keys****

Generate the WireGuard keys on each node:

- **Command** (run on each node, replacing `<node-name>` with `master-01`, `worker-01`, or `cloud-vm`):
  ```bash
  wg genkey | tee /etc/wireguard/privatekey.<node-name>-wg0 | wg pubkey | tee /etc/wireguard/publickey.<node-name>-wg0
  sudo chmod 400 /etc/wireguard/privatekey.<node-name>-wg0
  ```
- **Why**: Generates a private/public key pair for each node. The private key secures the node’s VPN identity, and the public key is shared with peers. `chmod 400` restricts access to the private key for security.

---

## **🛠️ **3. Configuring WireGuard****

- **Action**: Create `/etc/wireguard/wg0.conf` on each node with the following configurations.
- **Why**: Defines the VPN interface (`wg0`) and specifies how nodes connect to each other securely.
- (Optional) To set **MTU** value, subtract 80 bytes from your network interface's MTU (e.g., for a 1500 MTU interface,
  use 1420). This allows for Wireguard encryption overhead. Usually this value is automatically detected and set.

---
### **Configurations**:

#### **Master-01:**

```ini
[Interface]
PrivateKey = <MASTER_01_PRIVATE_KEY>
Address = 10.0.0.1/24 # Assign the IP address 10.0.0.1 to the master node.
ListenPort = 51820

# Peer: cloud-vm
[Peer]
PublicKey = <CLOUD_VM_PUBLIC_KEY>
Endpoint = <CLOUD_VM_PUBLIC_IP>:51820
AllowedIPs = 10.0.2.0/24 # Allow entire 10.0.2.X subnet.
PersistentKeepalive = 25

# Peer: worker-01
[Peer]
PublicKey = <WORKER_01_PUBLIC_KEY>
Endpoint = <LOCAL_IP>:51820 # 192.168.5.4
AllowedIPs = 10.0.1.0/24 # Allow entire 10.0.1.X subnet.
PersistentKeepalive = 25
```

---

#### **Worker-01:**

```ini
[Interface]
PrivateKey = <WORKER_01_PRIVATE_KEY>
Address = 10.0.1.1/24 # Assign the IP address 10.0.1.1 to the master node.
ListenPort = 51820

# Peer: cloud-vm
[Peer]
PublicKey = <CLOUD_VM_PUBLIC_KEY>
Endpoint = <CLOUD_VM_PUBLIC_IP>:51820
AllowedIPs = 10.0.2.0/24 # Allow entire 10.0.2.X subnet.
PersistentKeepalive = 25

# Peer: master-01
[Peer]
PublicKey = <MASTER_01_PUBLIC_KEY>
Endpoint = <LOCAL_IP>:51820 # 192.168.5.3
AllowedIPs = 10.0.0.0/24 # Allow entire 10.0.0.X subnet.
PersistentKeepalive = 25
```

---

#### **Cloud-vm:**

```ini
[Interface]
PrivateKey = <CLOUD_VM_PRIVATE_KEY>
Address = 10.0.2.1/24 # Assign 10.0.2.1 IP to cloud-vm
ListenPort = 51820

# Peer: master-01
[Peer]
PublicKey = <MASTER_01_PUBLIC_KEY>
Endpoint = <ROUTERS_PUBLIC_IP>:51820 # Port Forwarding: The router's port 51820 is mapped to the master's port 51820.
AllowedIPs = 10.0.0.0/24 # Allow entire 10.0.0.X subnet.
PersistentKeepalive = 25

# Peer: worker-01
[Peer]
PublicKey = <WORKER_01_PUBLIC_KEY>
Endpoint = <ROUTERS_PUBLIC_IP>:52820 # Port Forwarding: The router's port 52820 is mapped to the worker's port 51820.
AllowedIPs = 10.0.1.0/24 # Allow entire 10.0.1.X subnet.
PersistentKeepalive = 25
```

---

#### **Explanation**:
  - **Interface**: Defines the node’s VPN identity (private key), IP address (e.g., `10.0.0.1`), and listening port (`51820`).
  - **Peer**: Specifies how to reach other nodes using their public keys and endpoints. `AllowedIPs` restricts traffic to specific ranges (e.g., `10.0.2.0/24` for `cloud-vm`).
  - **PersistentKeepalive**: Sends a packet every 25 seconds to maintain the connection, crucial for nodes behind NAT (like home nodes).
  - **Endpoints**: `cloud-vm` uses the router’s public IP with forwarded ports (`51820` for `master-01`, `52820` for `worker-01`). Home nodes use local IPs for each other.


---

## **🔄 **4. Enabling IP Forwarding****

- **Command** (run on all nodes):
  ```bash
  echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```
- **Why**: Enables nodes to forward VPN traffic, allowing communication between non-directly connected peers (e.g., `master-01` to `cloud-vm` via `worker-01`).

## **🚀 **5. Starting WireGuard****

**Start and Enable WireGuard on all nodes:**

- **Command** (run on all nodes):
  ```bash
  sudo systemctl start wg-quick@wg0
  sudo systemctl enable wg-quick@wg0
  ```
- **Why**: Starts the WireGuard interface (`wg0`) and ensures it activates on boot for persistent connectivity.

---

## **✅ **6. Verifying the VPN Mesh****

- **Check the handshake status on each node:**
    ```bash
    wg show
    ```

- **If ICMP protocol is disabled then enable it in firewall on all nodes:**
    ```bash
    sudo firewall-cmd --permanent --zone=trusted --remove-icmp-block=echo-reply
    sudo firewall-cmd --permanent --zone=trusted --remove-icmp-block=echo-request
    sudo firewall-cmd --permanent --zone=trusted --remove-icmp-block-inversion
    sudo firewall-cmd --reload
    ```

- **Verify VPN connectivity between the nodes using `ping`. **ssh** into the respective nodes and using ping verify packet
  transfer.**

- **Commands**:
  - From `cloud-vm`:
    ```bash
    ping 10.0.0.1 -c 4  # Ping master-01
    ping 10.0.1.1 -c 4  # Ping worker-01
    ```
  - From `master-01`:
    ```bash
    ping 10.0.1.1 -c 4  # Ping worker-01
    ping 10.0.2.1 -c 4  # Ping cloud-vm
    ```
  - From `worker-01`:
    ```bash
    ping 10.0.0.1 -c 4  # Ping master-01
    ping 10.0.2.1 -c 4  # Ping cloud-vm
    ```
    
- **Why**: Confirms that all nodes can communicate over the VPN, ensuring the tunnel is operational. **Make sure to not have any packet loss.**

---

### Troubleshooting

With this command you can enable the debug logging in WireGuard:

```bash
echo 'module wireguard +p' | sudo tee /sys/kernel/debug/dynamic_debug/control
```

And the same command with -p can disable it again:

```bash
echo 'module wireguard -p' | sudo tee /sys/kernel/debug/dynamic_debug/control
```
