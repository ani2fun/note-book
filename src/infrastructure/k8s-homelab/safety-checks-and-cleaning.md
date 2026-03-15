##  Safety checks before touching anything

### Purpose

Confirm the environment is safe to work on.

### Run on each node

```bash
hostname -f
uname -a
ip -br addr
```

### What success looks like

- You can log in to all four hosts.
- Each host shows the expected name.
- The network interfaces look normal.

### Do not continue if

- one of the nodes is unreachable
- you are not sure which machine is which
- SSH is already flaky

---

## Clean the old environment

### Purpose

Remove old K3s, CNI, WireGuard, firewall, and routing leftovers so the rebuild starts clean.

### Warning

> This phase is destructive. It removes cluster state, overlay state, and old firewall rules.

### Recommended node order

1. `ctb-edge-1`
2. `ms-1`
3. `wk-1`
4. `wk-2`

### 1. Create a backup snapshot on each node

```bash
sudo -i
NODE="REPLACE_ME"     # ctb-edge-1 OR ms-1 OR wk-1 OR wk-2
TS="$(date -u +%Y%m%dT%H%M%SZ)"
BK="/root/backup-phase1-${NODE}-${TS}"
mkdir -p "$BK"

ip -br addr > "$BK/ip-addr.txt"
ip route show table all > "$BK/ip-route-table-all.txt"
ip rule show > "$BK/ip-rule.txt"
ip -6 rule show > "$BK/ip6-rule.txt" 2>/dev/null || true

(command -v wg >/dev/null && wg show || true) > "$BK/wg-show.txt" 2>&1

sysctl net.ipv4.ip_forward > "$BK/sysctl-ip_forward.txt" 2>&1 || true
sysctl net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter > "$BK/sysctl-rp_filter.txt" 2>&1 || true
sysctl net.ipv4.conf.wg0.rp_filter > "$BK/sysctl-wg0-rp_filter.txt" 2>&1 || true

iptables-save > "$BK/iptables-save.txt" 2>&1 || true
iptables -S > "$BK/iptables-S.txt" 2>&1 || true
ip6tables-save > "$BK/ip6tables-save.txt" 2>&1 || true
ip6tables -S > "$BK/ip6tables-S.txt" 2>&1 || true
nft list ruleset > "$BK/nft-ruleset.txt" 2>&1 || true

systemctl list-unit-files | grep -E 'k3s|rke2|kube|containerd|cri|wg-quick|wireguard|nftables|ufw|firewalld|iptables' \
  > "$BK/unit-files-grep.txt" 2>&1 || true

tar -czf "$BK/etc-snap.tgz" /etc/wireguard /etc/rancher /etc/cni /etc/sysctl.d /etc/sysctl.conf 2>/dev/null || true

echo "Backup complete: $BK"
ls -lah "$BK"
```

### 2. Stop and disable services

```bash
sudo -i

systemctl disable --now wg-quick@wg0 2>/dev/null || true
systemctl disable --now k3s 2>/dev/null || true
systemctl disable --now k3s-agent 2>/dev/null || true
systemctl disable --now containerd 2>/dev/null || true
```

### 3. Uninstall K3s if present

```bash
sudo -i
if [ -x /usr/local/bin/k3s-uninstall.sh ]; then
  /usr/local/bin/k3s-uninstall.sh
fi

if [ -x /usr/local/bin/k3s-agent-uninstall.sh ]; then
  /usr/local/bin/k3s-agent-uninstall.sh
fi
```

### 4. Remove leftover files

```bash
sudo -i

rm -rf /etc/rancher/k3s /var/lib/rancher/k3s /var/lib/kubelet /var/lib/cni
rm -rf /etc/cni/net.d /opt/cni/bin
rm -rf /var/lib/calico /var/run/calico /run/calico 2>/dev/null || true
rm -rf /etc/wireguard
rm -f /etc/systemd/system/k3s.service /etc/systemd/system/k3s-agent.service
systemctl daemon-reload
```

### 5. Delete leftover interfaces

```bash
sudo -i

for IF in wg0 cni0 flannel.1 vxlan.calico kube-ipvs0 tunl0; do
  ip link show "$IF" >/dev/null 2>&1 && ip link del "$IF" 2>/dev/null || true
done

for IF in $(ip -o link show | awk -F': ' '{print $2}' | grep -E '^cali' || true); do
  ip link del "$IF" 2>/dev/null || true
done
```

### 6. Remove extra policy routing rules

Check first:

```bash
ip rule show
ip -6 rule show 2>/dev/null || true
```

Delete extra rules beyond the defaults, for example:

```bash
ip rule del pref 1000
```

### 7. Flush firewall state safely

```bash
sudo -i

systemctl disable --now ufw 2>/dev/null || true
systemctl disable --now firewalld 2>/dev/null || true
systemctl disable --now nftables 2>/dev/null || true

iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT
iptables -F
iptables -t nat -F
iptables -t mangle -F
iptables -t raw -F
iptables -X

ip6tables -P INPUT ACCEPT 2>/dev/null || true
ip6tables -P FORWARD ACCEPT 2>/dev/null || true
ip6tables -P OUTPUT ACCEPT 2>/dev/null || true
ip6tables -F 2>/dev/null || true
ip6tables -t nat -F 2>/dev/null || true
ip6tables -t mangle -F 2>/dev/null || true
ip6tables -t raw -F 2>/dev/null || true
ip6tables -X 2>/dev/null || true

command -v nft >/dev/null && nft flush ruleset || true
```

### 8. Remove sysctl overrides related to old experiments

```bash
sudo -i
find /etc/sysctl.d -maxdepth 1 -type f \
  \( -iname '*k3s*' -o -iname '*k8s*' -o -iname '*kube*' -o -iname '*kubernetes*' -o -iname '*calico*' -o -iname '*cni*' -o -iname '*wireguard*' -o -iname '*wg*' \) \
  -print

find /etc/sysctl.d -maxdepth 1 -type f \
  \( -iname '*k3s*' -o -iname '*k8s*' -o -iname '*kube*' -o -iname '*kubernetes*' -o -iname '*calico*' -o -iname '*cni*' -o -iname '*wireguard*' -o -iname '*wg*' \) \
  -exec rm -f {} \;

sysctl --system >/dev/null 2>&1 || true
```

### 9. Verify the cleanup

```bash
echo "== wg =="
wg show 2>/dev/null || true

echo "== k3s/kubelet/calico/flannel processes =="
ps aux | egrep -i 'k3s|kubelet|calico|flannel|cni' | grep -v egrep || true

echo "== interfaces that should NOT exist =="
ip -br link | egrep 'wg0|cni0|flannel\.1|vxlan\.calico|kube-ipvs0|tunl0|cali' || true

echo "== suspicious routes (pod/service/cni leftovers) =="
ip route show table all | egrep -i '10\.42\.|10\.43\.|cni|flannel|calico|vxlan|wg0' || true

echo "== ip rules (should be defaults only) =="
ip rule show

echo "== firewall (should be near-empty) =="
iptables -S | head -n 60
iptables -t nat -S | head -n 60
nft list ruleset 2>/dev/null | head -n 120 || true
```

### Expected result

You should see:

- no active `wg0`
- no K3s, Calico, flannel, or kubelet leftovers
- no pod/service routes from old clusters
- almost empty firewall state

---
