# Setup Wireguard Mesh

## Table of contents

> Jump to [Phase 2 implementation](#phase-2-wireguard-implementation) if you already understand the concepts.

- [Architecture](#architecture)
- [Concepts explained from scratch](#concepts-explained-from-scratch)
- [Safety rules](#safety-rules)
- [Phase 2 (WireGuard) implementation](#phase-2-wireguard-implementation)
- [Design decisions and trade-offs](#design-decisions--trade-offs)
- [Glossary](#glossary)
- [Further learning](#further-learning-links-official--high-quality)

---

## Architecture

### Nodes

**Home LAN (behind NAT/router)**

* Router LAN: `192.168.15.1/24`
* Public WAN IP: `203.0.113.10`
* Nodes:

    * `ms-1` (K3s server): `192.168.15.2`
    * `wk-1`: `192.168.15.3`
    * `wk-2`: `192.168.15.4`

**Public cloud edge (Contabo)**

* `ctb-edge-1`: public IP `198.51.100.25`
* Single public edge for `kakde.eu` + subdomains
* In later phases: Traefik binds **host ports 80/443** on this node

### WireGuard overlay (Phase 2)

Overlay subnet (WireGuard only): `172.27.15.0/24` but **each node uses a /32**

* `wk-1` = `172.27.15.11/32`
* `ms-1` = `172.27.15.12/32`
* `wk-2` = `172.27.15.13/32`
* `ctb-edge-1` = `172.27.15.31/32`

### Router UDP forwards (required for edge → home)

* `203.0.113.10:51820 -> wk-1:51820`
* `203.0.113.10:51821 -> ms-1:51820`
* `203.0.113.10:51822 -> wk-2:51820`

---

## Concepts explained from scratch

### NAT and port forwarding

Home devices usually sit behind a router using **NAT** (Network Address Translation).
That means the internet can’t directly “reach” home machines unless the router is told to forward traffic.

Here we forward **UDP** ports from the router’s public IP (`203.0.113.10`) into each home node’s WireGuard port `51820`.

### WireGuard and wg-quick

**WireGuard** is a modern VPN that creates an encrypted network interface (commonly `wg0`).
**wg-quick** is a helper that:

* reads `/etc/wireguard/wg0.conf`
* creates the interface + routes
* sets keys + peers
* brings it up/down via systemd (`wg-quick@wg0`)

### AllowedIPs and /32 routes

In WireGuard, `AllowedIPs` is both:

1. a **routing rule** (“to reach this IP, send it to that peer”), and
2. an **access control** rule (“this peer is allowed to claim these source IPs”).

Your rule is strict and safe:

* **AllowedIPs = peer /32 only** (one IP per peer)
* No broad ranges like `/24`
* This prevents accidental routing leaks and keeps debugging predictable.

### PersistentKeepalive

When a node is behind NAT, inbound traffic can die when the NAT mapping expires.
`PersistentKeepalive = 25` sends a tiny packet every ~25 seconds to keep the path open.

Rule in this build:

* Keepalives **only from home nodes toward the edge** (because home is behind NAT)

### rp_filter and why it breaks “handshake ok but ping fails”

Linux has a “reverse path filtering” setting called **rp_filter**.
If it’s too strict, Linux drops packets that arrive on an interface that it doesn’t think is the “best reverse path”.

WireGuard full-mesh and multi-homing often benefit from:

* `rp_filter=2` (**loose mode**)
  This reduces false drops while staying safer than disabling it entirely.

### MTU basics

**MTU** is the maximum packet size an interface sends without fragmentation.
VPN encapsulation adds overhead; if MTU is too high, you get weird “works sometimes” issues.

Baseline used here:

* `MTU = 1420` on wg0 everywhere (safe general value for WAN VPN links)

---

## Safety rules

* **Never lock yourself out of SSH.** Don’t enable a firewall policy unless you’ve confirmed SSH is allowed.
* Treat private keys like passwords:

    * `/etc/wireguard/wg0.key` must stay private on that node
    * share **public keys only**
* Make small changes, verify after each step.

---

## Phased workflow

* **Phase 1:** Wipe old cluster + network artifacts ✅ *Reported complete*
* **Phase 2:** WireGuard full mesh ✅ *This doc provides exact configs + commands*
* **Phase 3:** K3s + Calico VXLAN ⏭️ *Next step after Phase 2 passes verification*
* **Phase 4:** Traefik edge-only exposure ⏭️

---

## Phase 1 (wipe) status + verification

You reported:

> “Phase 1 complete on ctb-edge-1, ms-1, wk-1, wk-2. All k3s/cni/wireguard artifacts removed, ip rules are defaults only, and firewall is flushed with managers disabled.”

Because Phase 1 is already done, here are **verification commands** to confirm the “pristine baseline” is real.

Run on **each node**:

```bash
ip -br addr
ip route show table all
ip rule show
wg show || true

# Firewall state checks
sudo iptables -S
sudo iptables-save | head -n 40
sudo nft list ruleset 2>/dev/null | head -n 80 || true

# Common leftovers checks
systemctl list-units --type=service | egrep -i 'k3s|rke2|wireguard|wg-quick|cilium|calico|flannel' || true
ls -la /etc/cni /var/lib/cni /etc/rancher /var/lib/rancher 2>/dev/null || true
```

**Good looks like**

* `wg show` shows nothing (or “interface: wg0” does **not** exist yet)
* No `k3s` services running
* `/etc/cni`, `/var/lib/cni`, `/etc/rancher`, `/var/lib/rancher` are empty or absent (depending on how you wiped)
* `ip rule show` contains only default rules (no custom policy routing)

**STOP/GO:** If anything looks “not clean”, stop and fix before Phase 2.

---

## Phase 2 (WireGuard) implementation

### 2.0 STOP/GO pre-checks

Run on **each node**:

```bash
ip -br a
ip route
sudo iptables -S | head -n 20
sudo nft list ruleset 2>/dev/null | head -n 40 || true
```

**Good looks like**

* SSH is still connected and stable
* No firewall rule is silently blocking UDP/51820

---

### 2.1 Install WireGuard

Run on **each node**:

```bash
sudo apt-get update
sudo apt-get install -y wireguard
wg version
```

---

### 2.2 Generate keys

Run on **each node**:

```bash
sudo -i
umask 077
wg genkey | tee /etc/wireguard/wg0.key | wg pubkey > /etc/wireguard/wg0.pub
cat /etc/wireguard/wg0.pub
```

**What to do with the output**

* Copy the **public key** and label it:

    * `<CTB_EDGE_1_PUB>`
    * `<MS_1_PUB>`
    * `<WK_1_PUB>`
    * `<WK_2_PUB>`

**Never share**

* `/etc/wireguard/wg0.key` (private key)

---

### 2.3 Set rp_filter safely

Run on **each node**:

```bash
sudo tee /etc/sysctl.d/99-wireguard.conf >/dev/null <<'EOF'
net.ipv4.conf.all.rp_filter=2
net.ipv4.conf.default.rp_filter=2
EOF
sudo sysctl --system
sysctl net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter
```

**Expected output**

* both values show `= 2`

---

### 2.4 Create wg-quick configs (per node)

> **Where to put configs:** `/etc/wireguard/wg0.conf`
> **How to start it:** `systemctl enable --now wg-quick@wg0`

#### A) `ctb-edge-1` — `/etc/wireguard/wg0.conf`

```ini
[Interface]
Address = 172.27.15.31/32
ListenPort = 51820
PrivateKey = <CTB_EDGE_1_PRIV>
MTU = 1420
SaveConfig = false

[Peer]
# wk-1 (via router WAN port-forward 51820 -> wk-1:51820)
PublicKey = <WK_1_PUB>
AllowedIPs = 172.27.15.11/32
Endpoint = 203.0.113.10:51820

[Peer]
# ms-1 (via router WAN port-forward 51821 -> ms-1:51820)
PublicKey = <MS_1_PUB>
AllowedIPs = 172.27.15.12/32
Endpoint = 203.0.113.10:51821

[Peer]
# wk-2 (via router WAN port-forward 51822 -> wk-2:51820)
PublicKey = <WK_2_PUB>
AllowedIPs = 172.27.15.13/32
Endpoint = 203.0.113.10:51822
```

Get the private key value for `<CTB_EDGE_1_PRIV>`:

```bash
sudo cat /etc/wireguard/wg0.key
```

Start + verify:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
sudo systemctl enable --now wg-quick@wg0

ip -br a show wg0
sudo ss -lunp | grep 51820
sudo wg show
ip route | grep 172.27.15
```

**Good looks like**

* wg0 exists and has `172.27.15.31/32`
* UDP :51820 is listening
* `/32` routes exist for each peer via wg0

---

#### B) `ms-1` — `/etc/wireguard/wg0.conf`

```ini
[Interface]
Address = 172.27.15.12/32
ListenPort = 51820
PrivateKey = <MS_1_PRIV>
MTU = 1420
SaveConfig = false

[Peer]
# ctb-edge-1 (public)
PublicKey = <CTB_EDGE_1_PUB>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# wk-1 (LAN)
PublicKey = <WK_1_PUB>
AllowedIPs = 172.27.15.11/32
Endpoint = 192.168.15.3:51820

[Peer]
# wk-2 (LAN)
PublicKey = <WK_2_PUB>
AllowedIPs = 172.27.15.13/32
Endpoint = 192.168.15.4:51820
```

Start + verify:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
sudo systemctl enable --now wg-quick@wg0
ip -br a show wg0
sudo wg show
ip route | grep 172.27.15
ping -c 3 172.27.15.31
```

**STOP/GO**

* Do not proceed until `ms-1 -> ctb-edge-1` ping succeeds.

---

#### C) `wk-1` — `/etc/wireguard/wg0.conf`

```ini
[Interface]
Address = 172.27.15.11/32
ListenPort = 51820
PrivateKey = <WK_1_PRIV>
MTU = 1420
SaveConfig = false

[Peer]
# ctb-edge-1 (public)
PublicKey = <CTB_EDGE_1_PUB>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# ms-1 (LAN)
PublicKey = <MS_1_PUB>
AllowedIPs = 172.27.15.12/32
Endpoint = 192.168.15.2:51820

[Peer]
# wk-2 (LAN)
PublicKey = <WK_2_PUB>
AllowedIPs = 172.27.15.13/32
Endpoint = 192.168.15.4:51820
```

Start + verify:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
sudo systemctl enable --now wg-quick@wg0
sudo wg show
ping -c 3 172.27.15.31
ping -c 3 172.27.15.12
ping -c 3 172.27.15.13
```

---

#### D) `wk-2` — `/etc/wireguard/wg0.conf`

```ini
[Interface]
Address = 172.27.15.13/32
ListenPort = 51820
PrivateKey = <WK_2_PRIV>
MTU = 1420
SaveConfig = false

[Peer]
# ctb-edge-1 (public)
PublicKey = <CTB_EDGE_1_PUB>
AllowedIPs = 172.27.15.31/32
Endpoint = 198.51.100.25:51820
PersistentKeepalive = 25

[Peer]
# ms-1 (LAN)
PublicKey = <MS_1_PUB>
AllowedIPs = 172.27.15.12/32
Endpoint = 192.168.15.2:51820

[Peer]
# wk-1 (LAN)
PublicKey = <WK_1_PUB>
AllowedIPs = 172.27.15.11/32
Endpoint = 192.168.15.3:51820
```

Start + verify:

```bash
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
sudo systemctl enable --now wg-quick@wg0
sudo wg show
ping -c 3 172.27.15.31
ping -c 3 172.27.15.12
ping -c 3 172.27.15.11
```

---

### 2.5 Verification checklist

Run on **each node**:

#### 1) Ensure /32 routes exist (one per peer)

```bash
ip route | grep 172.27.15
```

**Expected**

* exactly three peer routes (each `/32`) via `wg0`

#### 2) Ensure handshakes are recent

```bash
sudo wg show
```

**Expected**

* each peer shows a “latest handshake” within a reasonable time window

#### 3) Ping every peer WG address

From each node, ping the other three:

```bash
ping -c 3 172.27.15.11
ping -c 3 172.27.15.12
ping -c 3 172.27.15.13
ping -c 3 172.27.15.31
```

(Only ping the ones that are “other nodes” from where you are.)

**STOP/GO (end of Phase 2)**
Proceed to Phase 3 only when:

* all nodes ping all other nodes over WireGuard
* `wg show` shows 3 peers with handshakes
* `AllowedIPs` everywhere are `/32` only

---

### 2.6 Debug playbook

#### A) No handshake at all

1. Check service and UDP listener:

```bash
systemctl status wg-quick@wg0 --no-pager
sudo ss -lunp | grep 51820
```

2. Confirm the peer public keys are correct on both sides:

```bash
sudo wg show
```

3. Packet visibility (best “truth detector”):

* On **ctb-edge-1**:

```bash
sudo tcpdump -ni any udp port 51820
```

* Restart WG on a home node to force packets:

```bash
sudo systemctl restart wg-quick@wg0
```

**Expected**

* You see UDP packets arriving on the edge

4. If edge can’t reach home:

* router port-forward mismatch is the most common cause (wrong external port → wrong internal host)

#### B) Handshake OK but ping fails

This is usually **routes**, **AllowedIPs**, **rp_filter**, or **firewall**.

1. Check routing decision:

```bash
ip route get 172.27.15.31
ip route get 172.27.15.12
```

2. Confirm AllowedIPs are strictly `/32`:

```bash
sudo wg show
```

3. Confirm rp_filter is loose mode:

```bash
sysctl net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter
```

4. Verify nothing is dropping ICMP:

```bash
sudo iptables -S
sudo iptables -L -nv
sudo nft list ruleset 2>/dev/null | sed -n '1,160p' || true
```

5. Watch ICMP on wg0:

```bash
sudo tcpdump -ni wg0 icmp
```

#### C) Home↔Home pings fail but edge works

Usually a wrong LAN endpoint or local blocking.

* Confirm LAN IPs:

```bash
ip -br addr
```

* Confirm home↔home endpoints in configs use `192.168.15.x:51820`
* Observe UDP on the LAN:

```bash
sudo tcpdump -ni any udp port 51820
```

---

### 2.7 Run-all scripts

#### `ctb-edge-1` minimal run-all

```bash
sudo apt-get update && sudo apt-get install -y wireguard
sudo chmod 600 /etc/wireguard/wg0.key /etc/wireguard/wg0.pub
sudo nano /etc/wireguard/wg0.conf
sudo chmod 600 /etc/wireguard/wg0.conf
sudo systemctl enable --now wg-quick@wg0
sudo wg show
```

#### Home nodes (`ms-1`, `wk-1`, `wk-2`) minimal run-all

```bash
sudo apt-get update && sudo apt-get install -y wireguard

sudo tee /etc/sysctl.d/99-wireguard.conf >/dev/null <<'EOF'
net.ipv4.conf.all.rp_filter=2
net.ipv4.conf.default.rp_filter=2
EOF
sudo sysctl --system

sudo nano /etc/wireguard/wg0.conf
sudo chmod 600 /etc/wireguard/wg0.conf /etc/wireguard/wg0.key
sudo systemctl enable --now wg-quick@wg0
sudo wg show
```

---

## Design decisions + trade-offs

### Full mesh (instead of hub-and-spoke)

**Why:** direct peer-to-peer connectivity simplifies Kubernetes node-to-node paths later and avoids creating a single dependency node for internal traffic.

**Trade-off:** more peer blocks to manage (3 peers per node).

### AllowedIPs = /32 per peer only

**Why:** least privilege routing; avoids accidental “route the world through WireGuard” mistakes.

**Trade-off:** if you later want to route whole subnets over WG, you must explicitly design that.

### Keepalive only from home → edge

**Why:** NAT mapping exists on the home router side, so the home nodes need to keep their NAT state alive.

**Trade-off:** none meaningful; it’s standard practice.

### MTU = 1420 on wg0

**Why:** safe baseline for internet paths and later VXLAN overlay work.

**Trade-off:** slightly lower maximum throughput than jumbo frames, but higher reliability.

### rp_filter=2

**Why:** prevents false drops in multi-interface routing situations that commonly happen with VPN overlays.

**Trade-off:** looser than strict mode; still much better than disabling completely.

---

## Open questions / assumptions

* Router UDP port forwards are correctly configured exactly as listed.
* Firewalls are flushed and not re-applied by another manager.
* Public keys are correctly exchanged and copied (most common human error is a swapped key).

If anything here is uncertain, the debug playbook (tcpdump + wg show + route checks) will reveal it quickly.

---

## Next steps (Phase 3 preview)

Once Phase 2 is fully verified, the next phase is:

* Install **K3s** with flannel disabled (`--flannel-backend=none`)
* Install **Calico** in **VXLAN** mode
* Choose MTU for pods that accounts for:

    * wg0 MTU (1420)
    * VXLAN overhead

## Glossary

* **CNI:** Container Network Interface (Kubernetes networking layer)
* **NAT:** Network Address Translation (router shares one public IP for many devices)
* **/32:** single IP route (one exact host address)
* **wg0:** the WireGuard network interface
* **wg-quick:** tool that brings WireGuard interfaces up/down from config
* **Endpoint:** where to send encrypted WireGuard packets (IP:port)
* **AllowedIPs:** what IPs a peer is allowed to use + what gets routed to that peer
* **MTU:** maximum packet size before fragmentation
* **rp_filter:** reverse path filtering (Linux anti-spoof check that can drop valid VPN traffic)

---

## Further learning links (official / high-quality)

* WireGuard (official): [https://www.wireguard.com/](https://www.wireguard.com/)
* `wg` and `wg-quick` man pages:

    * [https://manpages.debian.org/wg](https://manpages.debian.org/wg)
    * [https://manpages.debian.org/wg-quick](https://manpages.debian.org/wg-quick)
* Linux `rp_filter` overview (kernel docs): [https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt](https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt)
* Systemd services basics: [https://www.freedesktop.org/software/systemd/man/systemctl.html](https://www.freedesktop.org/software/systemd/man/systemctl.html)
* MTU and troubleshooting fragmentation (practical reference): [https://wiki.wireshark.org/MTU](https://wiki.wireshark.org/MTU)
