# Setup Kubernetes

> Current note
> This is a detailed historical deep dive. For the current rebuild path, start with [01-platform-overview.md](01-platform-overview.md) and [02-rebuild-cluster-step-by-step.md](02-rebuild-cluster-step-by-step.md).

## Table of contents

1. [What this document is](#what-this-document-is)
2. [Architecture](#current-architecture)
3. [Concepts](#concepts-explained-simply)
4. [Phase 3 implementation steps](#phase-3-implementation-steps)
5. [Troubleshooting](#troubleshooting-guide)
6. [Official references](#official-references)

---

## What this document is

This document turns the current document history into a clean Phase 3 runbook for a beginner. It explains what was decided, why it was decided, exactly which commands to run, where to run them, how to verify success, and what to watch out for.

This document covers only the material that exists in the current document history. It does **not** invent later phases or assume any work that has not been discussed yet.

---

## Current architecture

This homelab has 4 Ubuntu 24.04 nodes.

### Home LAN nodes

* `ms-1` = K3s server, LAN `192.168.15.2`, WireGuard `172.27.15.12`
* `wk-1` = worker, LAN `192.168.15.3`, WireGuard `172.27.15.11`
* `wk-2` = worker, LAN `192.168.15.4`, WireGuard `172.27.15.13`

### Public edge node

* `ctb-edge-1` = Contabo public edge, public IP `198.51.100.25`, WireGuard `172.27.15.31`

### Overlay networking already verified before Phase 3

The document established that a full-mesh WireGuard setup is already working, with peer `/32` routes and successful handshakes and pings across `172.27.15.0/24`. This Phase 3 runbook starts **after** that point.

---

## What Phase 3 is trying to achieve

Phase 3 installs Kubernetes and pod networking in a way that matches the homelab design:

* `ms-1` becomes the **single K3s server**
* `wk-1`, `wk-2`, and `ctb-edge-1` become **K3s agents**
* K3s is installed with **Flannel disabled**
* K3s packaged **Traefik is disabled**
* K3s built-in network policy controller is disabled so **Calico** provides networking and policy
* Calico is installed in **VXLAN** mode
* Node internal communication is anchored to the **WireGuard IPs**
* `ms-1` is treated as **control-plane only**
* `ctb-edge-1` is treated as **edge-only by opt-in**
* Minimal host firewall guardrails are added and later made reboot-safe

K3s supports disabling packaged components with `--disable`, including Traefik, and documents that Traefik is deployed by default unless disabled. K3s also documents disabling its embedded network policy controller with `--disable-network-policy`. ([docs.k3s.io][1])

Calico’s K3s multi-node guidance explicitly shows disabling Flannel and disabling K3s default network policy when installing K3s for Calico. ([docs.tigera.io][2])

---

## Decisions made

### 1. Disable K3s Traefik now, install Traefik later

This was chosen so the cluster does **not** auto-deploy Traefik in a generic way and then later fight with a custom edge-only Traefik deployment. K3s deploys Traefik by default and recommends `--disable=traefik` to remove or prevent it. ([docs.k3s.io][1])

### 2. Use Calico VXLAN, not BGP

This keeps routing simpler for a homelab. Calico documents VXLAN as an overlay mode that avoids requiring the underlay network to understand pod IPs, and notes that VXLAN does not use BGP between Calico nodes the way Calico IP-in-IP does. ([docs.tigera.io][3])

### 3. Use WireGuard IPs as node internal addresses

The document intentionally pinned each node to its WireGuard IP so Kubernetes node-to-node communication stays on the overlay.

### 4. Keep `ms-1` for control-plane duties only

The document decided that user workloads should avoid `ms-1` and instead go to the workers or edge.

### 5. Make `ctb-edge-1` opt-in only

The document decided that public-edge workloads should run on `ctb-edge-1` only when explicitly requested using labels, taints, tolerations, and selectors.

### 6. Use a dedicated resolver file for K3s

All four nodes showed `/etc/resolv.conf` pointing to the systemd-resolved stub at `127.0.0.53`. K3s checks resolver files for unusable loopback, multicast, or link-local nameservers and supports `--resolv-conf` to supply a suitable alternative file. ([docs.k3s.io][4])

---

## Corrections made during the document

One important correction happened.

### `rp_filter`

Earlier document drafts used `rp_filter=0` in some places, and there was confusion about `1` versus `2`. The corrected recommendation is:

* `0` = disabled
* `1` = strict
* `2` = loose

The Linux kernel documentation says strict mode is good for spoof protection, but if the system uses asymmetric or more complicated routing, **loose mode (`2`) is recommended**. It also states that the **maximum** of `conf/all` and `conf/<interface>` is what actually applies. For this WireGuard + Calico VXLAN setup, the corrected baseline is **`rp_filter=2`**, with `0` kept only as a fallback troubleshooting option. ([Kernel Documentation][5])

---

## Concepts explained simply

### What is K3s?

K3s is a lightweight Kubernetes distribution. It still runs standard Kubernetes components, but it bundles common pieces like CoreDNS, metrics-server, and Traefik unless you disable them. ([docs.k3s.io][1])

### What is Flannel?

Flannel is the default CNI-style pod networking fabric in K3s. K3s documents Flannel as a layer-3 network fabric and a CNI plugin. In this homelab, Flannel is disabled because Calico will provide pod networking instead. ([docs.k3s.io][6])

### What is Calico?

Calico is the networking and network policy layer for the cluster. In this setup, it provides:

* pod networking
* Kubernetes NetworkPolicy enforcement
* VXLAN encapsulation between nodes

The Tigera operator installation API is the supported way to configure a Calico operator-based install. ([docs.tigera.io][7])

### What is VXLAN?

VXLAN is an overlay technique. It wraps workload traffic so the underlying network does not need to know pod addresses. Calico documents VXLAN as an encapsulation option that works without BGP between Calico nodes. ([docs.tigera.io][3])

### What is `--resolv-conf`?

K3s can pass a resolver file path through to kubelet using `--resolv-conf`. This matters when the normal host resolver file uses systemd-resolved’s local stub, because loopback resolvers do not work the same way inside pods. ([docs.k3s.io][4])

### What is `rp_filter`?

`rp_filter` is Linux reverse path filtering. It checks whether a packet’s source looks valid according to the routing table.

* `0` = disabled
* `1` = strict
* `2` = loose

The kernel docs recommend loose mode when routing is asymmetric or otherwise complex, which matches this homelab better than strict mode. ([Kernel Documentation][5])

### Why is MTU discussed here?

Overlay networking adds headers and reduces effective payload size. Calico documents that VXLAN has extra per-packet overhead and also supports setting the VXLAN MTU explicitly. In this document, the chosen design was to set Calico MTU to **1370** because the underlay WireGuard interface is `1420` and the document intentionally reserved headroom for VXLAN encapsulation. That exact `1370` value is a design choice from this document, not a universal fixed value. ([docs.tigera.io][8])

---

## Prerequisites and assumptions

Before following this runbook, these things are assumed to already be true because they were established earlier in the document:

* WireGuard full mesh works across all four nodes
* Each node can reach the others on their `172.27.15.x` address
* The kernel/sysctl basics were already checked:

    * `net.ipv4.ip_forward = 1`
    * `net.bridge.bridge-nf-call-iptables = 1`
* Each node uses Ubuntu 24.04
* SSH remains available on port 22
* The chosen K3s version in the document is `v1.35.1+k3s1`

The resolver output captured in the document showed all four nodes using the systemd-resolved stub:

* `/etc/resolv.conf -> /run/systemd/resolve/stub-resolv.conf`
* `nameserver 127.0.0.53`

That is why this runbook uses a dedicated K3s resolver symlink and `--resolv-conf`.

---

## Phase 3 implementation steps

## Step 1: Prepare resolver file for K3s on all nodes

### Why this step exists

K3s checks `/etc/resolv.conf` and `/run/systemd/resolve/resolv.conf` for unusable loopback, multicast, or link-local nameservers. If needed, you can explicitly point it at a suitable file with `--resolv-conf`. The document’s node outputs showed the normal `/etc/resolv.conf` on all nodes pointing at `127.0.0.53`, so this step is necessary here. ([docs.k3s.io][4])

### Run on

* `ms-1`
* `wk-1`
* `wk-2`
* `ctb-edge-1`

### Commands

```bash
install -d -m 0755 /etc/rancher/k3s
ln -sf /run/systemd/resolve/resolv.conf /etc/rancher/k3s/k3s-resolv.conf

readlink -f /etc/rancher/k3s/k3s-resolv.conf
grep -E '^(nameserver|search|options)' /etc/rancher/k3s/k3s-resolv.conf
```

### What the commands do

* create `/etc/rancher/k3s` if it does not exist
* create a stable symlink called `k3s-resolv.conf`
* verify that the file points to the non-stub resolver
* print the DNS servers that K3s will use

### Good looks like

On the home nodes, you should see real upstream resolvers such as `192.168.15.1`. On the edge node, you should see the Contabo-provided resolver IPs.

---

## Step 2: Install K3s server on ms-1

### Why this step exists

This turns `ms-1` into the only K3s server, disables Flannel, disables Traefik, disables the embedded network policy controller, and pins the node identity to the WireGuard IP.

K3s documents that server nodes also support agent options, and K3s plus Calico guidance shows disabling Flannel and K3s default network policy for this install pattern. ([docs.k3s.io][9])

### Run on

* `ms-1`

### Commands

```bash
export INSTALL_K3S_VERSION="v1.35.1+k3s1"

curl -sfL https://get.k3s.io | \
  K3S_KUBECONFIG_MODE="644" \
  INSTALL_K3S_EXEC="server \
    --node-ip=172.27.15.12 \
    --advertise-address=172.27.15.12 \
    --tls-san=172.27.15.12 \
    --flannel-backend=none \
    --disable-network-policy \
    --disable=traefik \
    --disable=servicelb \
    --resolv-conf=/etc/rancher/k3s/k3s-resolv.conf \
    --cluster-cidr=10.42.0.0/16 \
    --service-cidr=10.43.0.0/16 \
    --node-label homelab.kakde.eu/role=server" \
  sh -
```

### What each important option means

* `--node-ip=172.27.15.12`
  tells K3s to register this node with the WireGuard IP
* `--advertise-address=172.27.15.12`
  tells the API server which address to advertise
* `--tls-san=172.27.15.12`
  allows the cert to include that address
* `--flannel-backend=none`
  disables Flannel because Calico will replace it
* `--disable-network-policy`
  disables K3s embedded network policy because Calico will provide policy
* `--disable=traefik`
  prevents packaged Traefik from being installed
* `--disable=servicelb`
  disables K3s ServiceLB because the design will use a custom ingress strategy later
* `--resolv-conf=...`
  gives K3s/kubelet a safe resolver file
* `--cluster-cidr` / `--service-cidr`
  set pod and service ranges
* `--node-label ...`
  adds a role label at registration time; K3s agent docs note that labels and taints added this way are applied at registration time only. ([docs.k3s.io][1])

### Verify on ms-1

```bash
systemctl status k3s --no-pager -l
k3s --version
ss -lntp | egrep ':6443'
kubectl get nodes -o wide
```

### Good looks like

* `k3s` service is running
* TCP `6443` is listening
* `ms-1` appears in `kubectl get nodes`
* it may still be `NotReady` until Calico is installed

---

## Step 3: Install Calico with VXLAN on ms-1

### Why this step exists

Calico will provide:

* pod networking
* NetworkPolicy
* VXLAN overlay

Calico’s operator installation API defines the `Installation` and `APIServer` resources used here. Calico’s IP autodetection docs show how to tell Calico to use the Kubernetes node internal IP, which is exactly what this homelab wants because the Kubernetes node internal IPs are the WireGuard addresses. ([docs.tigera.io][7])

### Run on

* `ms-1`

### Commands

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.31.4/manifests/operator-crds.yaml
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.31.4/manifests/tigera-operator.yaml

cat >/root/calico-custom-resources.yaml <<'EOF'
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  calicoNetwork:
    bgp: Disabled
    mtu: 1370
    nodeAddressAutodetectionV4:
      kubernetes: NodeInternalIP
    ipPools:
    - cidr: 10.42.0.0/16
      encapsulation: VXLAN
      natOutgoing: Enabled
      nodeSelector: all()
---
apiVersion: operator.tigera.io/v1
kind: APIServer
metadata:
  name: default
spec: {}
EOF

kubectl create -f /root/calico-custom-resources.yaml
```

### Why `kubectl create` is used here

The document used `create`, and Calico documentation notes that large CRD bundles can exceed request limits with `apply`; Calico docs recommend `create` or `replace` in those cases. ([docs.tigera.io][10])

### Why `nodeAddressAutodetectionV4: kubernetes: NodeInternalIP`

Calico docs say this tells Calico to pick the first internal IP from the Kubernetes node status. That matches the design here because K3s registers the nodes using the WireGuard addresses. ([docs.tigera.io][11])

### Verify on ms-1

```bash
kubectl get pods -A -o wide | egrep 'tigera|calico|coredns|metrics' || true
kubectl get nodes -o wide
ip link show vxlan.calico || true
ip -d link show vxlan.calico 2>/dev/null | egrep 'vxlan|mtu' || true
```

### Good looks like

* `tigera-operator` is running
* `calico-node` is running on `ms-1`
* `ms-1` becomes `Ready`
* `vxlan.calico` exists
* MTU is set to the intended value or the resulting effective value reflects the chosen config

---

## Step 4: Add edge host guardrails before joining ctb-edge-1

### Why this step exists

`ctb-edge-1` is public. The cluster should not expose kubelet, VXLAN, or NodePort ranges to the internet on the public interface.

The port choices here come directly from the document design:

* block `10250/tcp` on public interface
* block `4789/udp` on public interface
* block `30000-32767` on public interface

### Run on

* `ctb-edge-1`

### First confirm the public interface name

Do not blindly assume it is `eth0`.

```bash
ip -br link
ip -br addr
```

If the public interface is really `eth0`, use the following as written. If not, replace `eth0` with the correct interface name.

### Commands

```bash
iptables -I INPUT 1 -i eth0 -p tcp --dport 10250 -j DROP
iptables -I INPUT 1 -i eth0 -p udp --dport 4789 -j DROP
iptables -I INPUT 1 -i eth0 -p tcp --dport 30000:32767 -j DROP
iptables -I INPUT 1 -i eth0 -p udp --dport 30000:32767 -j DROP

iptables -S INPUT | head -n 40
```

### What these rules do

They only block those ports on the **public interface**, not globally. SSH and WireGuard stay separate from this step.

### Good looks like

You can see the DROP rules near the top of the INPUT chain, and your SSH session remains alive.

---

## Step 5: Join the agents

### Why this step exists

This turns the other three nodes into K3s agents and pins each one to its WireGuard IP.

K3s agent docs explicitly document `--node-label` and `--node-taint` at registration time. ([docs.k3s.io][12])

### Step 5A: Get the token from ms-1

#### Run on

* `ms-1`

#### Command

```bash
cat /var/lib/rancher/k3s/server/node-token
```

Copy the output somewhere temporarily. You will paste it into the agent install commands.

---

### Step 5B: Join wk-1

#### Run on

* `wk-1`

#### Command

```bash
export INSTALL_K3S_VERSION="v1.35.1+k3s1"
curl -sfL https://get.k3s.io | \
  K3S_URL="https://172.27.15.12:6443" \
  K3S_TOKEN="<PASTE_NODE_TOKEN_HERE>" \
  INSTALL_K3S_EXEC="agent \
    --node-ip=172.27.15.11 \
    --resolv-conf=/etc/rancher/k3s/k3s-resolv.conf \
    --node-label homelab.kakde.eu/role=worker" \
  sh -
```

---

### Step 5C: Join wk-2

#### Run on

* `wk-2`

#### Command

```bash
export INSTALL_K3S_VERSION="v1.35.1+k3s1"
curl -sfL https://get.k3s.io | \
  K3S_URL="https://172.27.15.12:6443" \
  K3S_TOKEN="<PASTE_NODE_TOKEN_HERE>" \
  INSTALL_K3S_EXEC="agent \
    --node-ip=172.27.15.13 \
    --resolv-conf=/etc/rancher/k3s/k3s-resolv.conf \
    --node-label homelab.kakde.eu/role=worker" \
  sh -
```

---

### Step 5D: Join ctb-edge-1

#### Run on

* `ctb-edge-1`

#### Command

```bash
export INSTALL_K3S_VERSION="v1.35.1+k3s1"
curl -sfL https://get.k3s.io | \
  K3S_URL="https://172.27.15.12:6443" \
  K3S_TOKEN="<PASTE_NODE_TOKEN_HERE>" \
  INSTALL_K3S_EXEC="agent \
    --node-ip=172.27.15.31 \
    --resolv-conf=/etc/rancher/k3s/k3s-resolv.conf \
    --node-label homelab.kakde.eu/role=edge" \
  sh -
```

### Verify after all joins

#### Run on

* `ms-1`

#### Command

```bash
kubectl get nodes -o wide
kubectl get pods -A -o wide | egrep 'tigera|calico|coredns' || true
```

### Good looks like

All four nodes appear and eventually become `Ready`, with INTERNAL-IP equal to the expected `172.27.15.x` value.

---

## Step 6: Apply workload placement policy

### Why this step exists

This enforces the placement policy discussed in the document:

* `ms-1` should not carry normal workloads
* `ctb-edge-1` should accept workloads only if they explicitly opt in
* `wk-1` and `wk-2` remain general worker nodes

### Run on

* `ms-1`

### Commands

```bash
kubectl get nodes -o wide

kubectl taint nodes ms-1 node-role.kubernetes.io/control-plane=true:NoSchedule --overwrite || true
kubectl taint nodes ctb-edge-1 homelab.kakde.eu/edge=true:NoSchedule --overwrite

kubectl label node ms-1 homelab.kakde.eu/role=server --overwrite
kubectl label node wk-1 homelab.kakde.eu/role=worker --overwrite
kubectl label node wk-2 homelab.kakde.eu/role=worker --overwrite
kubectl label node ctb-edge-1 homelab.kakde.eu/role=edge --overwrite

kubectl get nodes --show-labels
kubectl describe node ms-1 | sed -n '/Taints:/,/Conditions:/p'
kubectl describe node ctb-edge-1 | sed -n '/Taints:/,/Conditions:/p'
```

### What these commands do

* taint `ms-1` so regular workloads are not scheduled there
* taint `ctb-edge-1` so only explicitly edge-marked workloads land there
* make sure role labels are correct

### Example of an edge-only pod spec

Use something like this in future manifests:

```yaml
spec:
  nodeSelector:
    homelab.kakde.eu/role: edge
  tolerations:
  - key: "homelab.kakde.eu/edge"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

### Good looks like

* `ms-1` shows a control-plane style `NoSchedule` taint
* `ctb-edge-1` shows `homelab.kakde.eu/edge=true:NoSchedule`

---

## Step 7: Verify the cluster

### Run on

* `ms-1`

### Commands

```bash
kubectl get nodes -o wide
kubectl get pods -A | egrep 'tigera|calico|coredns'
kubectl -n tigera-operator get pods -o wide
```

### Good looks like

* all nodes are `Ready`
* `calico-node` is running on all nodes
* `coredns` is running
* Tigera operator is running

---

## Step 8: Smoke-test pod networking and DNS

### Why this step exists

It proves that pod networking and cluster DNS work after the install.

### Run on

* `ms-1`

### Commands

```bash
kubectl create ns nettest || true

kubectl -n nettest run p1 --image=busybox:1.36 --command -- sh -c "sleep 36000"
kubectl -n nettest run p2 --image=busybox:1.36 --command -- sh -c "sleep 36000"

kubectl -n nettest get pods -o wide

P2IP="$(kubectl -n nettest get pod p2 -o jsonpath='{.status.podIP}')"
kubectl -n nettest exec -it p1 -- ping -c 3 "$P2IP"
kubectl -n nettest exec -it p1 -- nslookup kubernetes.default.svc.cluster.local
```

### Important note

This quick test proves pod networking works, but because both pods are unscheduled test pods, Kubernetes might place them on the same node by chance. If you want to prove **cross-node** traffic specifically, use a manifest that pins `p1` and `p2` to different nodes.

### Good looks like

* ping succeeds
* DNS resolves `kubernetes.default.svc.cluster.local`
* cluster DNS server appears as something like `10.43.0.10`

---

## Make host firewall rules survive reboot

### Why this section exists

Rules added with `iptables` are **not** persistent by default across reboot. The document explicitly asked about this.

Also, K3s and Calico will rebuild their **own** rules at startup. What needs persistence here are only the custom host guardrail rules created for:

* `ms-1`
* `ctb-edge-1`

The chosen approach in the document was a **systemd oneshot service** that reapplies only the small custom guardrail set. This avoids flushing tables and avoids stepping on K3s/Calico state.

---

### Persist ms-1 host guardrails

#### Run on

* `ms-1`

#### Commands

```bash
cat >/usr/local/sbin/homelab-fw-ms1.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

iptables -C INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT 2>/dev/null || iptables -I INPUT 1 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -C INPUT -i lo -j ACCEPT 2>/dev/null || iptables -I INPUT 2 -i lo -j ACCEPT
iptables -C INPUT -p tcp --dport 22 -j ACCEPT 2>/dev/null || iptables -I INPUT 3 -p tcp --dport 22 -j ACCEPT

iptables -C INPUT -i wg0 -s 172.27.15.0/24 -p tcp --dport 6443 -j ACCEPT 2>/dev/null || iptables -I INPUT 4 -i wg0 -s 172.27.15.0/24 -p tcp --dport 6443 -j ACCEPT
iptables -C INPUT -p tcp --dport 6443 -j DROP 2>/dev/null || iptables -A INPUT -p tcp --dport 6443 -j DROP
EOF

chmod +x /usr/local/sbin/homelab-fw-ms1.sh

cat >/etc/systemd/system/homelab-fw-ms1.service <<'EOF'
[Unit]
Description=Homelab host firewall guardrails (ms-1)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/homelab-fw-ms1.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now homelab-fw-ms1.service
systemctl status homelab-fw-ms1.service --no-pager -l
iptables -S INPUT | egrep 'dport 6443|dport 22|ESTABLISHED' || true
```

### What this does

* re-adds safe baseline accept rules
* allows K3s API only over `wg0`
* drops `6443` from everywhere else
* makes the behavior reapply on boot

---

### Persist ctb-edge-1 host guardrails

#### Run on

* `ctb-edge-1`

#### Commands

```bash
cat >/usr/local/sbin/homelab-fw-edge.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

iptables -C INPUT -i eth0 -p tcp --dport 10250 -j DROP 2>/dev/null || iptables -I INPUT 1 -i eth0 -p tcp --dport 10250 -j DROP
iptables -C INPUT -i eth0 -p udp --dport 4789 -j DROP 2>/dev/null || iptables -I INPUT 1 -i eth0 -p udp --dport 4789 -j DROP
iptables -C INPUT -i eth0 -p tcp --dport 30000:32767 -j DROP 2>/dev/null || iptables -I INPUT 1 -i eth0 -p tcp --dport 30000:32767 -j DROP
iptables -C INPUT -i eth0 -p udp --dport 30000:32767 -j DROP 2>/dev/null || iptables -I INPUT 1 -i eth0 -p udp --dport 30000:32767 -j DROP

ip6tables -C INPUT -i eth0 -p tcp --dport 10250 -j DROP 2>/dev/null || ip6tables -I INPUT 1 -i eth0 -p tcp --dport 10250 -j DROP
ip6tables -C INPUT -i eth0 -p udp --dport 4789 -j DROP 2>/dev/null || ip6tables -I INPUT 1 -i eth0 -p udp --dport 4789 -j DROP
ip6tables -C INPUT -i eth0 -p tcp --dport 30000:32767 -j DROP 2>/dev/null || ip6tables -I INPUT 1 -i eth0 -p tcp --dport 30000:32767 -j DROP
ip6tables -C INPUT -i eth0 -p udp --dport 30000:32767 -j DROP 2>/dev/null || ip6tables -I INPUT 1 -i eth0 -p udp --dport 30000:32767 -j DROP
EOF

chmod +x /usr/local/sbin/homelab-fw-edge.sh

cat >/etc/systemd/system/homelab-fw-edge.service <<'EOF'
[Unit]
Description=Homelab host firewall guardrails (ctb-edge-1)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/homelab-fw-edge.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now homelab-fw-edge.service
systemctl status homelab-fw-edge.service --no-pager -l
iptables -S INPUT | egrep '10250|4789|30000:32767' || true
ip6tables -S INPUT | egrep '10250|4789|30000:32767' || true
```

### Important reminder

If the public interface is not `eth0`, replace `eth0` before using this script.

---

## Expected healthy output

The document included a concrete example of what “healthy” Phase 3 output should look like. In plain English, it looked like this:

### 1. Pod networking works

From `p1`, ping to `p2` succeeds with `0% packet loss`.

### 2. Cluster DNS works

`nslookup kubernetes.default.svc.cluster.local` returns a valid service IP, such as `10.43.0.1`, and shows a cluster DNS server like `10.43.0.10`.

### 3. Calico and Tigera are healthy

You should see:

* `calico-apiserver`
* `calico-kube-controllers`
* `calico-node` on all nodes
* `calico-typha`
* `csi-node-driver`
* `tigera-operator`
* `coredns`

all in `Running` state.

### 4. All nodes are Ready

A healthy `kubectl get nodes -o wide` in the document showed:

* `ctb-edge-1` Ready, INTERNAL-IP `172.27.15.31`
* `ms-1` Ready, INTERNAL-IP `172.27.15.12`
* `wk-1` Ready, INTERNAL-IP `172.27.15.11`
* `wk-2` Ready, INTERNAL-IP `172.27.15.13`

That is the target state.

---

## Troubleshooting guide

## Symptom: K3s starts but pod DNS fails

### Check the resolver configuration

K3s documents that it checks resolver files for unusable nameservers and allows an override with `--resolv-conf`. ([docs.k3s.io][4])

### Run

```bash
grep -R "resolv-conf" /etc/systemd/system/k3s*.service /etc/systemd/system/k3s-agent*.service 2>/dev/null || true
cat /etc/rancher/k3s/k3s-resolv.conf
kubectl -n kube-system get pods -l k8s-app=kube-dns -o wide
kubectl -n kube-system logs -l k8s-app=kube-dns --tail=100
```

### What to look for

* the K3s service actually includes `--resolv-conf=/etc/rancher/k3s/k3s-resolv.conf`
* that file contains real upstream DNS servers, not `127.0.0.53`

---

## Symptom: Nodes do not become Ready after Calico install

### Check

```bash
kubectl get pods -A -o wide
kubectl -n tigera-operator logs deploy/tigera-operator --tail=200
kubectl get installation default -o yaml
```

### What to look for

* operator pod errors
* bad installation resource values
* IP autodetection choosing the wrong address

Calico documents the `nodeAddressAutodetectionV4` methods, including `kubernetes: NodeInternalIP`, which is the expected setting here. ([docs.tigera.io][11])

---

## Symptom: Overlay traffic is flaky

### First check `rp_filter`

The corrected baseline is `2`, not `1`, and only drop to `0` if testing proves loose mode is still interfering. The kernel docs explicitly recommend loose mode for asymmetric or more complex routing. ([Kernel Documentation][5])

### Run

```bash
sysctl net.ipv4.conf.all.rp_filter
sysctl net.ipv4.conf.default.rp_filter
sysctl net.ipv4.conf.wg0.rp_filter
```

### Good looks like

All three return `2`.

### If you need to set them

```bash
cat >/etc/sysctl.d/99-k3s-calico.conf <<'EOF'
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
net.bridge.bridge-nf-call-iptables=1
net.bridge.bridge-nf-call-ip6tables=1
net.ipv4.conf.all.rp_filter=2
net.ipv4.conf.default.rp_filter=2
net.ipv4.conf.wg0.rp_filter=2
EOF

sysctl --system
```

---

## Symptom: Edge node exposes ports you did not want

### Run

```bash
ss -lntup | egrep ':(10250|4789|3[0-9]{4})' || true
iptables -S INPUT | egrep '10250|4789|30000:32767' || true
ip6tables -S INPUT | egrep '10250|4789|30000:32767' || true
```

### What to look for

* listeners on unexpected public ports
* missing DROP rules
* missing persistence service

---

## Symptom: Workloads land on ms-1 or edge unexpectedly

### Run

```bash
kubectl describe node ms-1 | sed -n '/Taints:/,/Conditions:/p'
kubectl describe node ctb-edge-1 | sed -n '/Taints:/,/Conditions:/p'
kubectl get nodes --show-labels
```

### What to look for

* missing taints
* wrong labels
* workloads that lack the required toleration or nodeSelector

---

## Common mistakes

* forgetting `--disable=traefik` and then later fighting the packaged Traefik deployment ([docs.k3s.io][1])
* forgetting `--disable-network-policy` when replacing K3s netpol with Calico netpol ([docs.k3s.io][13])
* forgetting `--resolv-conf` even though `/etc/resolv.conf` points to `127.0.0.53` ([docs.k3s.io][4])
* assuming `iptables` commands persist after reboot
* assuming the public interface is always `eth0`
* using `rp_filter=1` in this overlay design instead of the corrected baseline `2` ([Kernel Documentation][5])
* treating the quick pod test as guaranteed cross-node proof when Kubernetes may schedule both test pods onto the same node

---

## Open questions and gaps

These are the things still left open or intentionally deferred in the document:

1. **Traefik deployment is not part of this phase.**
   The design decision is clear, but the actual deployment belongs to Phase 4.

2. **Public interface name on ctb-edge-1 must be confirmed.**
   The firewall examples use `eth0`, but the real name may differ.

3. **The exact Calico MTU value is an intentional design choice from this document.**
   It is conservative and reasonable for `wg0=1420`, but it should still be verified in practice using actual traffic tests.

4. **A stronger cross-node pod test can be added later.**
   The simple `kubectl run` smoke test is fine for a first pass but does not force scheduling across different nodes.

---

## Next step after this document

The next phase is to deploy **Traefik only on `ctb-edge-1`**:

* bind host ports `80` and `443`
* schedule only on the edge node
* require explicit edge tolerations/selectors
* keep public exposure minimal
* verify from both raw IP and DNS

That is outside this document, but this document prepares the cluster for it cleanly.

---

## Official references

K3s packaged components and disabling add-ons: Traefik, metrics-server, local-storage, and others are managed as packaged components; K3s supports disabling them with `--disable`. ([docs.k3s.io][1])

K3s networking services: Traefik is deployed by default on server start, can be disabled with `--disable=traefik`, and the embedded network policy controller can be disabled with `--disable-network-policy`. ([docs.k3s.io][13])

K3s advanced configuration: K3s checks resolver files for loopback, multicast, or link-local nameservers and supports `--resolv-conf` for a supplied alternative. ([docs.k3s.io][4])

K3s air-gap install note: `--resolv-conf` is passed through to kubelet. ([docs.k3s.io][14])

K3s server and agent CLI docs: server nodes support agent options; agents support `--node-label` and `--node-taint` at registration time. ([docs.k3s.io][9])

Calico on K3s multi-node install: disable Flannel and disable K3s default network policy when using Calico. ([docs.tigera.io][2])

Calico installation API: operator-driven `Installation` and `APIServer` resources configure the install. ([docs.tigera.io][7])

Calico IP autodetection: `kubernetes: NodeInternalIP` makes Calico use the Kubernetes node internal IP. ([docs.tigera.io][11])

Calico VXLAN behavior: VXLAN is an overlay mode, has more encapsulation overhead than IP-in-IP, and does not rely on BGP between Calico nodes. ([docs.tigera.io][3])

Calico VXLAN MTU setting: Calico supports an explicit VXLAN MTU configuration. ([docs.tigera.io][8])

Linux kernel `rp_filter`: values `0`, `1`, and `2`; loose mode is recommended for asymmetric or complicated routing; the maximum of `conf/all` and `conf/<interface>` applies. ([Kernel Documentation][5])

---

## Prompt for the next document

Paste this into the next document when you are ready:

> Phase 3 is complete and verified. K3s server is on ms-1 with flannel disabled, traefik disabled, and K3s default network policy disabled. Calico is installed via Tigera operator in VXLAN mode with MTU 1370 and nodeAddressAutodetectionV4 set to Kubernetes NodeInternalIP, so all nodes use their WireGuard IPs as INTERNAL-IP: wk-1=172.27.15.11, ms-1=172.27.15.12, wk-2=172.27.15.13, ctb-edge-1=172.27.15.31. Pod-to-pod ping works, CoreDNS resolves kubernetes.default.svc.cluster.local, and Calico/Tigera pods are healthy. ms-1 is tainted to avoid workloads, and ctb-edge-1 is tainted so only explicit edge workloads can run there. Host guardrail firewall rules are persisted using systemd oneshot services. Begin Phase 4: deploy Traefik only on ctb-edge-1, bind host ports 80/443, use strict scheduling constraints, keep no PROXY protocol, and add minimal edge firewall policy with external verification against 198.51.100.25 and kakde.eu.

If you want, I can also turn this into a shorter “commands-only runbook” version.

[1]: https://docs.k3s.io/installation/packaged-components "Managing Packaged Components | K3s"
[2]: https://docs.tigera.io/calico/latest/getting-started/kubernetes/k3s/multi-node-install "K3s multi-node install | Calico Documentation"
[3]: https://docs.tigera.io/calico/latest/networking/configuring/vxlan-ipip "Overlay networking - Calico Documentation - Tigera.io"
[4]: https://docs.k3s.io/advanced "Advanced Options / Configuration | K3s"
[5]: https://docs.kernel.org/networking/ip-sysctl.html "IP Sysctl — The Linux Kernel  documentation"
[6]: https://docs.k3s.io/networking/basic-network-options "Basic Network Options | K3s"
[7]: https://docs.tigera.io/calico/latest/reference/installation/api "Installation reference | Calico Documentation"
[8]: https://docs.tigera.io/calico/latest/reference/felix/configuration "Configuring Felix"
[9]: https://docs.k3s.io/cli/server "server | K3s"
[10]: https://docs.tigera.io/calico/latest/getting-started/kubernetes/nftables "Data plane guide: nftables - Calico Documentation"
[11]: https://docs.tigera.io/calico/latest/networking/ipam/ip-autodetection "Configure IP autodetection | Calico Documentation"
[12]: https://docs.k3s.io/cli/agent "agent | K3s"
[13]: https://docs.k3s.io/networking/networking-services "Networking Services | K3s"
[14]: https://docs.k3s.io/installation/airgap "Air-Gap Install | K3s"
