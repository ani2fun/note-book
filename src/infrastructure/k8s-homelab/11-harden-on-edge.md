# Harden Public Exposure on the Edge Node

> Current note
> This is a supporting hardening runbook. For the main current build path, start with [06-platform-services-step-by-step.md](06-platform-services-step-by-step.md) and use [16-operations-and-recovery.md](16-operations-and-recovery.md) for day-2 checks.

### Purpose

Reduce the public attack surface on `ctb-edge-1` and verify what is really visible from outside.

### Important lesson

Do **not** trust a self-scan from the edge node to its own public IP.

A self-scan can be misleading because the route can loop back locally.

Always verify public exposure from another host, for example `ms-1`.

### 1. Run the audit block on all nodes

```bash
TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK="/root/backup-${TS}-phase5A-firewall"
mkdir -p "$BK"

echo "### HOST" | tee "$BK/00-host.txt"
hostname -f | tee -a "$BK/00-host.txt"
uname -a | tee -a "$BK/00-host.txt"
timedatectl status | sed -n '1,12p' | tee -a "$BK/00-host.txt"

echo "### NET" | tee "$BK/10-net.txt"
ip -br addr | tee "$BK/ip-br-addr.txt"
ip route show table all | tee "$BK/ip-route-all.txt"
ip rule show | tee "$BK/ip-rule.txt"
sysctl net.ipv4.ip_forward | tee "$BK/sysctl-ip_forward.txt"
sysctl net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter 2>/dev/null | tee "$BK/sysctl-rp_filter.txt" || true

echo "### LISTENING PORTS" | tee "$BK/20-ports.txt"
ss -lntup | tee "$BK/ss-tcp.txt"
ss -lnup  | tee "$BK/ss-udp.txt"

echo "### WIREGUARD" | tee "$BK/30-wireguard.txt"
wg show 2>/dev/null | tee "$BK/wg-show.txt" || echo "wg not present/running" | tee "$BK/wg-show.txt"

echo "### IPTABLES" | tee "$BK/40-iptables.txt"
iptables -S | tee "$BK/iptables-S.txt"
iptables-save | tee "$BK/iptables-save.txt"

echo "### NFTABLES" | tee "$BK/50-nft.txt"
nft list ruleset 2>/dev/null | tee "$BK/nft-ruleset.txt" || echo "nft not present/running" | tee "$BK/nft-ruleset.txt"

echo "### FIREWALL SERVICES" | tee "$BK/60-services.txt"
systemctl is-enabled --quiet nftables && echo "nftables: enabled" || echo "nftables: disabled" | tee -a "$BK/60-services.txt"
systemctl is-active  --quiet nftables && echo "nftables: active"  || echo "nftables: inactive" | tee -a "$BK/60-services.txt"
systemctl is-enabled --quiet ufw && echo "ufw: enabled" || echo "ufw: disabled" | tee -a "$BK/60-services.txt"
systemctl is-active  --quiet ufw && echo "ufw: active"  || echo "ufw: inactive" | tee -a "$BK/60-services.txt"
systemctl is-enabled --quiet firewalld && echo "firewalld: enabled" || echo "firewalld: disabled" | tee -a "$BK/60-services.txt"
systemctl is-active  --quiet firewalld && echo "firewalld: active"  || echo "firewalld: inactive" | tee -a "$BK/60-services.txt"

echo "BACKUP_DIR=$BK"
```

On `ms-1`, also check:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes -o wide
kubectl -n traefik get pods -o wide
```

### 2. Install Nmap and probe the public surface

Run on `ctb-edge-1`:

```bash
apt-get update -y
apt-get install -y nmap

nmap -Pn -sT -p 22,80,443,6443,9345,10250 198.51.100.25
nmap -Pn -sU -p 51820 198.51.100.25
nmap -Pn -sT -p 22,80,443,6443,9345,10250 203.0.113.10
nmap -Pn -sU -p 51820-51822 203.0.113.10
```

### 3. Show why self-scan is not enough

On `ctb-edge-1`:

```bash
ip route get 198.51.100.25
```

Then confirm from `ms-1`:

```bash
nmap -Pn -sT -p 22,80,443,10250 198.51.100.25
```

### 4. Diagnose nftables and iptables interaction

Run on `ctb-edge-1`:

```bash
systemctl is-active nftables || true
nft list ruleset | sed -n '1,200p'
echo "---- hook input chains ----"
nft list ruleset | grep -n "hook input" || true
echo "---- iptables (if any) ----"
iptables -S | sed -n '1,80p'
```

### 5. Apply the stronger `edgeguard` pre-filter

Set up rollback protection first:

```bash
apt-get update -y
apt-get install -y at nftables
systemctl enable --now atd

TS="$(date -u +%Y%m%dT%H%M%SZ)"
RBK="/root/backup-${TS}-edgeguard"
mkdir -p "$RBK"
nft list ruleset > "$RBK/nft.before.conf" 2>/dev/null || true

echo "nft -f '$RBK/nft.before.conf' 2>/dev/null || true" | at now + 2 minutes
echo "Rollback scheduled. Keep this SSH session open."
atq
```

Now apply the rules:

```bash
ADMIN_V4="$(echo "${SSH_CONNECTION:-}" | awk '{print $1}')"
echo "ADMIN_V4=$ADMIN_V4"

nft delete table inet edgeguard 2>/dev/null || true

cat > /root/edgeguard.nft <<'EOEDGE'
table inet edgeguard {
  chain input {
    type filter hook input priority -200; policy drop;

    ct state established,related accept
    iif "lo" accept

    ip protocol icmp accept
    ip6 nexthdr ipv6-icmp accept

    iifname "wg0" accept
    iifname "cali*" accept
    iifname "vxlan.calico" accept
    iifname "cni0" accept

    #__SSH_ALLOW__

    udp dport 51820 accept
    tcp dport { 80, 443 } accept
  }
}
EOEDGE

if [ -n "$ADMIN_V4" ]; then
  sed -i "s|#__SSH_ALLOW__|ip saddr ${ADMIN_V4}/32 tcp dport 22 accept|" /root/edgeguard.nft
else
  sed -i "s|#__SSH_ALLOW__|tcp dport 22 accept|" /root/edgeguard.nft
fi

nft -c -f /root/edgeguard.nft
nft -f /root/edgeguard.nft

nft -a list chain inet edgeguard input | sed -n '1,200p'
```

Persist it:

```bash
mkdir -p /etc/nftables.d
install -m 0644 /root/edgeguard.nft /etc/nftables.d/edgeguard.nft

cat > /etc/nftables.conf <<'EONFT'
#!/usr/sbin/nft -f
include "/etc/nftables.d/*.nft"
EONFT

nft -c -f /etc/nftables.conf
systemctl enable --now nftables
```

Validate from `ms-1`:

```bash
nmap -Pn -sT -p 22,80,443,10250 198.51.100.25
```

Cancel rollback only after confirming a second SSH session still works:

```bash
atq
# atrm <JOBID>
```

Optional proof test:

On `ctb-edge-1`:

```bash
tcpdump -ni eth0 tcp port 10250
```

From `ms-1`:

```bash
nc -vz -w 2 198.51.100.25 10250
curl -vk --connect-timeout 2 https://198.51.100.25:10250/ 2>&1 | head -n 20
```

### Expected result

From outside the edge host should expose only what it is meant to expose:

- `22/tcp` for administration
- `80/tcp` and `443/tcp` for web traffic
- `51820/udp` for WireGuard

Unwanted ports like `10250/tcp` should no longer be reachable.

---
