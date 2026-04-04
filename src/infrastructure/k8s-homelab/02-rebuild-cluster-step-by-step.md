# Rebuild Cluster Step by Step

This guide takes you from clean machines to a healthy base cluster.

By the end of this phase, you will have:

- a working four-node WireGuard mesh
- a K3s control plane on `ms-1`
- three joined worker nodes
- Calico networking
- the placement labels and taints that the rest of the platform depends on

This is the foundation for everything that comes later. Do not continue to ingress, TLS, Argo CD, PostgreSQL, or Keycloak until this phase is healthy.

## Before You Start

Make sure these assumptions are true:

- you can SSH to `ms-1`, `wk-1`, `wk-2`, and `vm-1`
- all four machines run Ubuntu 24.04
- you have `sudo` or root access on every node
- your home router can forward UDP ports for WireGuard
- `vm-1` is the SSH name of the public cloud node that will appear in Kubernetes as `ctb-edge-1`

Use these reference addresses throughout the build:

| Node | Purpose | LAN IP | WireGuard IP |
| --- | --- | --- | --- |
| `ms-1` | K3s server | `192.168.15.2` | `172.27.15.12` |
| `wk-1` | worker | `192.168.15.3` | `172.27.15.11` |
| `wk-2` | worker | `192.168.15.4` | `172.27.15.13` |
| `vm-1` / `ctb-edge-1` | public edge worker | n/a | `172.27.15.31` |

## Step 0: Confirm The Machines Are Safe To Use

On each node, run:

```bash
hostname -f
uname -a
ip -br addr
```

You are checking three things:

- you are on the machine you think you are on
- the network interfaces look normal
- SSH connectivity is stable before you begin making changes

If you are rebuilding on reused machines and suspect old Kubernetes, CNI, WireGuard, or firewall leftovers, stop here and use the destructive cleanup guide in [03-safety-checks-and-cleaning.md](03-safety-checks-and-cleaning.md).

## Step 1: Build The WireGuard Mesh

WireGuard is the first real dependency of the cluster. K3s will use the WireGuard IPs as node IPs, so do not move forward until this network is working cleanly.

### 1. Install WireGuard on every node

Run on `ms-1`, `wk-1`, `wk-2`, and `vm-1`:

```bash
sudo apt-get update
sudo apt-get install -y wireguard wireguard-tools
```

### 2. Generate a key pair on every node

Run on each node:

```bash
sudo install -d -m 700 /etc/wireguard
sudo sh -c 'umask 077 && wg genkey | tee /etc/wireguard/wg0.key | wg pubkey > /etc/wireguard/wg0.pub'
sudo cat /etc/wireguard/wg0.pub
```

Collect the four public keys before continuing. You will paste them into the matching peer entries below.

### 3. Configure the home router

The home router must forward these UDP ports from the home public IP to the home nodes:

- `203.0.113.10:51820/udp -> wk-1:51820/udp`
- `203.0.113.10:51821/udp -> ms-1:51820/udp`
- `203.0.113.10:51822/udp -> wk-2:51820/udp`

The cloud edge node connects back into the home network through those forwarded ports.

### 4. Apply the WireGuard sysctl setting

On each node, create the sysctl file:

```bash
cat <<'EOF' | sudo tee /etc/sysctl.d/99-wireguard.conf >/dev/null
net.ipv4.conf.all.rp_filter=2
net.ipv4.conf.default.rp_filter=2
EOF

sudo sysctl --system
```

### 5. Create `wg0.conf` on each node

Replace every placeholder with the real private key or peer public key you generated.

For the `PrivateKey` field, paste the actual contents of `/etc/wireguard/wg0.key` on that node.

On `ms-1`:

```ini
[Interface]
Address = 172.27.15.12/32
ListenPort = 51820
PrivateKey = <MS_1_PRIVATE_KEY>
MTU = 1420
SaveConfig = false

[Peer]
# vm-1 / ctb-edge-1
PublicKey = <VM_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# wk-1
PublicKey = <WK_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.11/32
Endpoint = 192.168.15.3:51820

[Peer]
# wk-2
PublicKey = <WK_2_PUBLIC_KEY>
AllowedIPs = 172.27.15.13/32
Endpoint = 192.168.15.4:51820
```

On `wk-1`:

```ini
[Interface]
Address = 172.27.15.11/32
ListenPort = 51820
PrivateKey = <WK_1_PRIVATE_KEY>
MTU = 1420
SaveConfig = false

[Peer]
# vm-1 / ctb-edge-1
PublicKey = <VM_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# ms-1
PublicKey = <MS_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.12/32
Endpoint = 192.168.15.2:51820

[Peer]
# wk-2
PublicKey = <WK_2_PUBLIC_KEY>
AllowedIPs = 172.27.15.13/32
Endpoint = 192.168.15.4:51820
```

On `wk-2`:

```ini
[Interface]
Address = 172.27.15.13/32
ListenPort = 51820
PrivateKey = <WK_2_PRIVATE_KEY>
MTU = 1420
SaveConfig = false

[Peer]
# vm-1 / ctb-edge-1
PublicKey = <VM_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# ms-1
PublicKey = <MS_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.12/32
Endpoint = 192.168.15.2:51820

[Peer]
# wk-1
PublicKey = <WK_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.11/32
Endpoint = 192.168.15.3:51820
```

On `vm-1`:

```ini
[Interface]
Address = 172.27.15.31/32
ListenPort = 51820
PrivateKey = <VM_1_PRIVATE_KEY>
MTU = 1420
SaveConfig = false

[Peer]
# wk-1 via home router forward 51820
PublicKey = <WK_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.11/32
Endpoint = 203.0.113.10:51820

[Peer]
# ms-1 via home router forward 51821
PublicKey = <MS_1_PUBLIC_KEY>
AllowedIPs = 172.27.15.12/32
Endpoint = 203.0.113.10:51821

[Peer]
# wk-2 via home router forward 51822
PublicKey = <WK_2_PUBLIC_KEY>
AllowedIPs = 172.27.15.13/32
Endpoint = 203.0.113.10:51822
```

**Optional: add an admin peer.** If you want to access the cluster from a laptop or workstation over WireGuard (for example, to run `kubectl` remotely), you can add an extra `[Peer]` block to each node's config. The full templates in `k8s-cluster/bootstrap/wireguard/` include an example admin peer at `172.27.15.50/32` with `PostUp`/`PostDown` route commands. This is not required for the cluster to function, but it is useful for remote administration without SSH jump hosts.

Save each of those as `/etc/wireguard/wg0.conf`, then lock down the permissions:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
```

### 6. Enable WireGuard

Run on each node:

```bash
sudo systemctl enable --now wg-quick@wg0
sudo systemctl status wg-quick@wg0 --no-pager
```

### 7. Verify the mesh before you continue

Run on every node:

```bash
wg show
ping -c 3 172.27.15.12
ping -c 3 172.27.15.11
ping -c 3 172.27.15.13
ping -c 3 172.27.15.31
```

Good looks like:

- every node shows peer handshakes in `wg show`
- every node can ping the other three WireGuard IPs
- no node is falling back to public-IP-based cluster communication

If the mesh is not healthy, fix WireGuard now. Kubernetes will be unreliable if you continue with a half-working private network.

## Step 2: Prepare the K3s DNS Resolver File

K3s will use a dedicated resolver path. Run this on every node:

```bash
for host in ms-1 wk-1 wk-2 vm-1; do
  ssh "$host" 'bash -s' < k8s-cluster/bootstrap/k3s/create-k3s-resolv-conf.sh
done
```

Verify on one or two nodes:

```bash
ssh ms-1 'readlink -f /etc/rancher/k3s/k3s-resolv.conf'
ssh wk-1 'grep -E "^(nameserver|search|options)" /etc/rancher/k3s/k3s-resolv.conf'
```

Expected result:

- `/etc/rancher/k3s/k3s-resolv.conf` points to `/run/systemd/resolve/resolv.conf`

## Step 3: Install the K3s Server on `ms-1`

The repository includes a helper script so you do not have to retype the full install flags. It installs K3s with:

- version `v1.35.1+k3s1`
- `172.27.15.12` as node IP and advertise address
- flannel disabled
- built-in network policy disabled
- built-in Traefik disabled
- ServiceLB disabled
- pod CIDR `10.42.0.0/16`
- service CIDR `10.43.0.0/16`

Run:

```bash
ssh ms-1 'bash -s' < k8s-cluster/bootstrap/k3s/install-server-ms-1.sh
```

Verify:

```bash
ssh ms-1 'sudo kubectl get nodes -o wide'
ssh ms-1 'sudo systemctl status k3s --no-pager'
```

At this moment, only `ms-1` should appear. It may still show `NotReady` because the CNI is not installed yet.

## Step 4: Install Calico on `ms-1`

Calico replaces flannel in this design and provides the pod network.

Run:

```bash
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; bash -s' < k8s-cluster/bootstrap/k3s/install-calico.sh
```

This install path is intentionally safe to rerun. It uses server-side apply, waits for the required CRDs, waits for the Tigera operator, and only then applies the Calico custom resources.

Verify:

```bash
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; kubectl get pods -n tigera-operator'
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; kubectl get pods -n calico-system'
```

## Step 5: Join the Three Agents

First, read the cluster join token from `ms-1`:

```bash
K3S_TOKEN="$(ssh ms-1 'sudo cat /var/lib/rancher/k3s/server/node-token')"
echo "$K3S_TOKEN"
```

Then join `wk-1`:

```bash
ssh wk-1 "export K3S_TOKEN='$K3S_TOKEN'; bash -s" < k8s-cluster/bootstrap/k3s/install-agent-wk-1.sh
```

Join `wk-2`:

```bash
ssh wk-2 "export K3S_TOKEN='$K3S_TOKEN'; bash -s" < k8s-cluster/bootstrap/k3s/install-agent-wk-2.sh
```

Join the public edge node:

```bash
ssh vm-1 "export K3S_TOKEN='$K3S_TOKEN'; bash -s" < k8s-cluster/bootstrap/k3s/install-agent-vm-1.sh
```

Verify from `ms-1`:

```bash
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; kubectl get nodes -o wide'
```

Expected internal IPs:

- `ms-1 -> 172.27.15.12`
- `wk-1 -> 172.27.15.11`
- `wk-2 -> 172.27.15.13`
- `ctb-edge-1 -> 172.27.15.31`

If a node registers with the wrong IP, stop and fix that before moving on. The cluster should use WireGuard IPs internally.

## Step 6: Apply Node Labels And Taints

The rest of the platform depends on predictable placement. Apply the baseline labels and taints now:

```bash
ssh ms-1 "export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; EDGE_NODE=ctb-edge-1 bash -s" < k8s-cluster/bootstrap/k3s/apply-node-placement.sh
```

This sets the platform up like this:

- `ms-1`: control-plane taint and server role label
- `wk-1`: worker role label
- `wk-2`: worker role label
- `ctb-edge-1`: edge role label plus `kakde.eu/edge=true:NoSchedule`

Verify:

```bash
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; kubectl get nodes --show-labels'
ssh ms-1 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml; kubectl describe node ctb-edge-1 | rg -n "Taints|Labels" -A6'
```

## Step 7: Run a Base Cluster Health Check

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes -o wide
kubectl get pods -n tigera-operator
kubectl get pods -n calico-system
kubectl get ns
```

Your base cluster is ready when:

- all four nodes are `Ready`
- Calico pods are healthy
- the Tigera operator is healthy
- node internal IPs match the WireGuard addresses
- the edge node is labeled and tainted correctly

## What You Have Now

At this point you have a private Kubernetes foundation that the rest of the homelab can trust.

You do not have public ingress yet.
You do not have TLS yet.
You do not have GitOps yet.
You do not have PostgreSQL or Keycloak yet.

That is exactly right. Those layers come next.

## Next Step

Continue with [06. Platform Services Step by Step](06-platform-services-step-by-step.md).
