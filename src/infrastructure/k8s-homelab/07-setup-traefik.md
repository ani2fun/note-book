# Setup Traefik on the Edge Node

> Current note
> This is a detailed historical deep dive. For the current platform setup, start with [01-platform-overview.md](01-platform-overview.md) and [06-platform-services-step-by-step.md](06-platform-services-step-by-step.md).

## Table of Contents

1. [Goal and architecture](#what-this-phase-is-trying-to-achieve)
2. [Key concepts](#important-concepts-explained-simply)
3. [Design decisions](#key-design-decisions)
4. [Step-by-step deployment](#step-1-snapshot-the-edge-node-and-verify-ports)
5. [Validation checklist](#validation-checklist)
6. [Troubleshooting](#troubleshooting-guide)
7. [Glossary](#glossary)

---

## What this document is

This deep-dive covers the full Traefik deployment on the homelab edge node, including the problems that were encountered and how they were solved: privileged port binding, rollout deadlock on host ports, and removal of the unnecessary admin port.

This guide assumes the cluster is already running with WireGuard, K3s, and Calico, and that Traefik is being deployed as the edge-only ingress controller. `ctb-edge-1` is the only public ingress node. Traefik binds host ports `80` and `443` there.

---

## What this phase is trying to achieve

The goal of this phase is to make Traefik the single internet-facing entry point for the cluster.

That means:

* Traefik runs only on `ctb-edge-1`
* it binds directly to host ports `80` and `443`
* the rest of the cluster stays private
* public exposure is limited to SSH, HTTP, HTTPS, and WireGuard on the edge node
* workloads are routed through Kubernetes ingress instead of public NodePorts.

This matters because the architecture intentionally centralizes ingress on one public node to reduce attack surface, simplify debugging, and keep internal services such as PostgreSQL private.

---

## Architecture used in this phase

The cluster layout used here is:

* `ms-1` → K3s server → `172.27.15.12`
* `wk-1` → K3s agent → `172.27.15.11`
* `wk-2` → K3s agent → `172.27.15.13`
* `ctb-edge-1` → public edge node + K3s agent → `172.27.15.31`
* public IP of `ctb-edge-1` → `198.51.100.25`

Networking assumptions:

* WireGuard full mesh is already working
* overlay subnet is `172.27.15.0/24`
* K3s is installed with flannel disabled
* Calico VXLAN is used for pod networking
* K3s built-in Traefik is disabled so Traefik can be deployed manually.

High-level traffic flow:

```text
Internet
   |
   v
ctb-edge-1 (Traefik)
   |
WireGuard / cluster network
   |
Kubernetes services inside the cluster
```

That matches the project architecture direction: one public edge only, private cluster internals, and ingress routed through Traefik.

---

## Important concepts explained simply

### What is an Ingress?

An Ingress is a Kubernetes rule that says:

> “When traffic comes for this hostname, send it to this service.”

Example:

```text
whoami.kakde.eu
      |
   Ingress
      |
   Service
      |
     Pod
```

But Ingress rules do nothing by themselves. They need an ingress controller to read them and enforce them. In this project, that controller is Traefik.

### What is an ingress controller?

An ingress controller is the actual software that listens on web ports and routes traffic according to Ingress objects. Without it, Kubernetes has routing rules on paper but no component actually handling the traffic.

### What does edge-only mean?

Edge-only means only the public edge machine should accept internet traffic. In this project, that machine is `ctb-edge-1`. Home nodes should not expose application ingress, Kubernetes API ports, or internal services publicly.

### What is `hostNetwork: true`?

Normally, Kubernetes pods use isolated container networking. When a pod uses:

```yaml
hostNetwork: true
```

it shares the node’s real network stack. That means if Traefik binds port `80` or `443`, it binds the actual host ports on `ctb-edge-1`. This is the simplest way to guarantee Traefik really listens on the public node.

### What are privileged ports?

Linux treats ports below `1024` as privileged. Examples include:

* `22`
* `80`
* `443`

A non-root container usually cannot bind those ports unless it has the capability `NET_BIND_SERVICE`. That became the real cause of the Traefik crash in this project.

### What are labels and taints?

A label is metadata attached to a node, such as:

```text
kakde.eu/edge=true
```

A taint is a scheduling repellent, such as:

```text
kakde.eu/edge=true:NoSchedule
```

Together, labels and taints help ensure that only the intended pod runs on the edge node. Traefik is allowed there, and regular workloads are discouraged from landing there by accident.

### Why use nftables here?

`nftables` is the modern Linux firewall framework. In this phase, the project used a dedicated table called `inet edge_guardrail` so the rules could be managed without flushing the whole host firewall. The guardrail logic was simple: allow only the required public services on `eth0`, allow all non-public interfaces like WireGuard and Calico, and drop the rest on the public NIC.

---

## Key design decisions

The merged document keeps these decisions as the final intended design:

* Traefik is deployed manually, not with K3s built-in defaults
* Traefik must run only on `ctb-edge-1`
* Traefik must bind host ports `80` and `443`
* public exposure on the edge should be minimal
* no unnecessary public admin port such as `9000`
* strict edge-only placement uses the label `kakde.eu/edge=true`
* strict edge taint uses `kakde.eu/edge=true:NoSchedule`
* the older taint `homelab.kakde.eu/edge=true:NoSchedule` was removed because it caused scheduling mismatch in this phase.

---

## Prerequisites

Before starting, make sure the cluster is healthy.

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes -o wide
kubectl get pods -A
```

Good looks like:

* all four nodes appear
* all nodes show `Ready`
* Calico and cluster core pods are healthy.

Also confirm the public network interface name on `ctb-edge-1`. The examples below assume `eth0`, but that should be verified first.

Run on `ctb-edge-1`:

```bash
ip -br link
ip -br addr
```

Good looks like:

* the public-facing interface is visible
* if the interface is not `eth0`, adjust the firewall script accordingly. This is important because the firewall allowlist depends on the correct public interface.

---

## Safe execution order

The safest order for this phase is:

1. snapshot the edge node
2. make sure ports `80` and `443` are free
3. install the edge firewall guardrail
4. label and taint the edge node properly
5. deploy Traefik pinned to the edge
6. capture logs if it fails
7. fix privileged port binding
8. fix rollout deadlock caused by host ports
9. remove the unnecessary admin port
10. verify that Traefik is really listening on the edge.

---

## Step 1: Snapshot the edge node and verify ports

This step protects the current state before changes are made.

Run on `ctb-edge-1`:

```bash
sudo -i
ts="$(date +%Y%m%d-%H%M%S)"
bdir="/root/backup-phase4-edge-$ts"
mkdir -p "$bdir"

ip -br addr | tee "$bdir/ip-br-addr.txt"
ip route show table all | tee "$bdir/ip-route-table-all.txt"
ip rule show | tee "$bdir/ip-rule-show.txt"
wg show 2>/dev/null | tee "$bdir/wg-show.txt" || true

sysctl net.ipv4.ip_forward | tee "$bdir/sysctl-ip_forward.txt"
sysctl net.ipv4.conf.all.rp_filter | tee "$bdir/sysctl-rpfilter-all.txt"
sysctl net.ipv4.conf.default.rp_filter | tee "$bdir/sysctl-rpfilter-default.txt"
sysctl net.ipv4.conf.wg0.rp_filter 2>/dev/null | tee "$bdir/sysctl-rpfilter-wg0.txt" || true

iptables-save | tee "$bdir/iptables-save.txt" || true
iptables -S | tee "$bdir/iptables-S.txt" || true
nft list ruleset 2>/dev/null | tee "$bdir/nft-ruleset.txt" || true

echo "Backup written to: $bdir"
```

Now check whether anything is already using ports `80` or `443`.

Run on `ctb-edge-1`:

```bash
sudo ss -lntup | egrep ':(80|443)\b' || echo "OK: nothing listening on 80/443 yet"
```

Good looks like:

* the backup directory exists
* nothing unexpected is already listening on `80` or `443`.

STOP/GO: continue only if the backup exists and SSH is still working normally.

---

## Step 2: Add the edge firewall guardrail

The firewall guardrail should only limit the public interface, not internal interfaces like WireGuard or Calico. That is why the rule set uses a dedicated nftables table and explicitly allows traffic not coming from the public NIC.

Run on `ctb-edge-1`:

```bash
sudo -i

cat >/usr/local/sbin/edge-guardrail.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

PUB_IF="eth0"

# Replace only our dedicated table (no global flush)
if nft list table inet edge_guardrail >/dev/null 2>&1; then
  nft delete table inet edge_guardrail
fi

# Apply in one batch; interface names are quoted correctly for nft ("eth0")
nft -f - <<NFT
add table inet edge_guardrail
add chain inet edge_guardrail input { type filter hook input priority -50; policy drop; }

# Keep local + established
add rule inet edge_guardrail input iifname "lo" accept
add rule inet edge_guardrail input ct state established,related accept

# Allow all traffic not coming from the public NIC (wg0, cali*, etc.)
add rule inet edge_guardrail input iifname != "$PUB_IF" accept

# Public NIC allowlist
add rule inet edge_guardrail input iifname "$PUB_IF" ip protocol icmp accept
add rule inet edge_guardrail input iifname "$PUB_IF" ip6 nexthdr icmpv6 accept
add rule inet edge_guardrail input iifname "$PUB_IF" udp dport 51820 accept
add rule inet edge_guardrail input iifname "$PUB_IF" tcp dport 22 accept
add rule inet edge_guardrail input iifname "$PUB_IF" tcp dport { 80, 443 } accept

# Drop everything else on eth0
add rule inet edge_guardrail input iifname "$PUB_IF" counter drop
NFT
EOF

chmod +x /usr/local/sbin/edge-guardrail.sh
/usr/local/sbin/edge-guardrail.sh

# Verify
nft list chain inet edge_guardrail input
```

Persist it with systemd so it survives reboot.

Run on `ctb-edge-1`:

```bash
sudo -i
cat >/etc/systemd/system/edge-guardrail.service <<'EOF'
[Unit]
Description=Edge guardrail firewall (nftables allowlist on eth0)
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/edge-guardrail.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now edge-guardrail.service
systemctl is-enabled edge-guardrail.service
systemctl is-active edge-guardrail.service
```

Good looks like:

* `nft list chain inet edge_guardrail input` shows the rules
* `systemctl is-enabled` returns `enabled`
* `systemctl is-active` returns `active`.

Important note: one real bug in the original work was using single quotes in nftables like this:

```text
iifname != 'eth0'
```

That fails. The correct form uses double quotes:

```text
iifname != "eth0"
```

That syntax issue was already encountered and corrected in the project.

STOP/GO: continue only if SSH still works and the chain is present.

---

## Step 3: Enforce strict edge-only scheduling

Traefik must run only on `ctb-edge-1`. This phase used a label and taint strategy for that. The earlier deployment hit a `Pending` state because of selector mismatch and an extra unwanted taint. The final corrected state removes the old taint and uses only the intended edge taint.

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .status.addresses[?(@.type=="InternalIP")]}{.address}{"\n"}{end}{end}' | sort

EDGE_NODE="$(kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{range .status.addresses[?(@.type=="InternalIP")]}{.address}{"\n"}{end}{end}' | awk '$2=="172.27.15.31"{print $1}')"
echo "EDGE_NODE=$EDGE_NODE"
```

Expected:

```text
EDGE_NODE=ctb-edge-1
```

Then apply the label and taint:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
EDGE_NODE="ctb-edge-1"

kubectl label node "$EDGE_NODE" kakde.eu/edge=true --overwrite

# Remove old/extra taint that caused scheduling failure
kubectl taint node "$EDGE_NODE" homelab.kakde.eu/edge- 2>/dev/null || true

# Enforce strict “edge-only” scheduling
kubectl taint node "$EDGE_NODE" kakde.eu/edge=true:NoSchedule --overwrite

# Verify
kubectl get node "$EDGE_NODE" --show-labels
kubectl describe node "$EDGE_NODE" | egrep -A3 'Taints|kakde.eu/edge|homelab.kakde.eu/edge' || true
```

Good looks like:

* `kakde.eu/edge=true` label exists
* `kakde.eu/edge=true:NoSchedule` taint exists
* `homelab.kakde.eu/edge` taint is gone.

STOP/GO: continue only if the node shows the correct label and taint state.

---

## Step 4: Deploy Traefik pinned to the edge node

At this stage, apply the prepared Traefik manifest. The project references `/root/traefik-edge.yaml` as the deployment manifest. Once scheduling is correct, the Traefik pod should land on `ctb-edge-1`. Earlier project notes confirm that scheduling success looked like `NODE=ctb-edge-1` and pod IP `172.27.15.31`.

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl apply -f /root/traefik-edge.yaml
kubectl -n traefik get pods -o wide
kubectl -n traefik rollout status deploy/traefik
```

Good looks like:

* the Traefik pod is created
* the pod is scheduled to `ctb-edge-1`
* rollout completes, or at least reaches a state that can be inspected cleanly.

If the pod becomes `CrashLoopBackOff`, go directly to diagnostics instead of guessing.

---

## Step 5: Capture diagnostics if Traefik fails

This is the correct workflow whenever Traefik crashes:

1. capture events
2. capture current logs
3. capture previous logs
4. decide the fix only after seeing the error.

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get ns traefik
kubectl -n traefik get pods -o wide

POD="$(kubectl -n traefik get pod -l app=traefik -o jsonpath='{.items[0].metadata.name}')"

kubectl -n traefik describe pod "$POD" | sed -n '/Events/,$p'
kubectl -n traefik logs "$POD" -c traefik --tail=200
kubectl -n traefik logs "$POD" -c traefik --previous --tail=200
```

In the earlier document, the crash was still unresolved at this point. In the later document, the logs clearly showed the real cause:

```text
listen tcp :80: bind: permission denied
```

That means Traefik could not bind port `80` because it lacked the Linux capability required for privileged ports.

---

## Step 6: Fix privileged port binding

Because Traefik is binding host ports `80` and `443`, it needs the `NET_BIND_SERVICE` capability. The later Traefik document captured this as the real fix.

Run on `ms-1`:

```bash
kubectl -n traefik patch deploy traefik --type='json' -p='[
  {
    "op":"add",
    "path":"/spec/template/spec/containers/0/securityContext",
    "value":{
      "allowPrivilegeEscalation":false,
      "readOnlyRootFilesystem":false,
      "capabilities":{
        "drop":["ALL"],
        "add":["NET_BIND_SERVICE"]
      }
    }
  }
]'
```

Restart Traefik:

```bash
kubectl -n traefik rollout restart deploy traefik
kubectl -n traefik rollout status deploy traefik
kubectl -n traefik get pods -o wide
```

Good looks like:

* the Traefik pod reaches `Running`
* the immediate `bind: permission denied` crash is gone.

Why this works:

* `drop: ["ALL"]` removes unnecessary privileges
* `add: ["NET_BIND_SERVICE"]` gives only the capability needed to bind privileged ports.

---

## Step 7: Fix rollout deadlock caused by host ports

A second real issue in the project happened during rollout. Kubernetes tried to start a second Traefik pod while the old one was still using the host ports `80`, `443`, and `9000`. Because host ports cannot be shared on the same node, the second pod stayed `Pending`. The later document captured this correctly and fixed it by changing the Deployment rollout strategy.

Check for the issue:

```bash
kubectl -n traefik get pods
kubectl -n traefik describe pod <pending-pod>
```

You may see something like:

```text
didn't have free ports for the requested pod ports
```

Patch the deployment strategy:

```bash
kubectl -n traefik patch deploy traefik --type='merge' -p '{
  "spec": {
    "strategy": {
      "type": "RollingUpdate",
      "rollingUpdate": {
        "maxSurge": 0,
        "maxUnavailable": 1
      }
    }
  }
}'
```

This effectively means:

```text
stop old pod first
then start new pod
```

If a stuck pending pod already exists, delete it:

```bash
kubectl -n traefik delete pod <pending-pod>
```

Then restart the rollout:

```bash
kubectl -n traefik rollout restart deploy traefik
kubectl -n traefik rollout status deploy traefik
kubectl -n traefik get pods -o wide
```

Good looks like:

* only one Traefik pod exists
* that pod is `Running`
* rollout completes successfully.

---

## Step 8: Remove the unnecessary admin port 9000

The project architecture explicitly says to avoid unnecessary public admin ports. The later Traefik notes removed port `9000` and switched readiness and liveness probes to simple TCP checks on port `80`. That reduces attack surface and simplifies the deployment.

Patch the deployment:

```bash
kubectl -n traefik patch deploy traefik --type='json' -p='[
  {"op":"replace","path":"/spec/template/spec/containers/0/livenessProbe","value":{
    "tcpSocket":{"port":80},
    "initialDelaySeconds":10,
    "periodSeconds":10,
    "failureThreshold":6
  }},
  {"op":"replace","path":"/spec/template/spec/containers/0/readinessProbe","value":{
    "tcpSocket":{"port":80},
    "initialDelaySeconds":3,
    "periodSeconds":5,
    "failureThreshold":6
  }}
]'
```

Restart after patching:

```bash
kubectl -n traefik rollout restart deploy traefik
kubectl -n traefik rollout status deploy traefik
kubectl -n traefik get pods -o wide
```

Good looks like:

* Traefik stays healthy
* the deployment no longer depends on port `9000`
* the pod remains `Running`.

---

## Step 9: Verify Traefik on the edge node

Now confirm that Traefik is actually listening on the edge machine.

Run on `ctb-edge-1`:

```bash
ss -lntup | egrep ':80 |:443 '
```

Expected:

* Traefik is listening on `80`
* Traefik is listening on `443`.

Test local HTTP on the edge:

```bash
curl -I http://127.0.0.1
```

Good looks like:

* HTTP responds
* a common expected response is `308 Permanent Redirect` to HTTPS.

External checks from another machine:

```bash
curl -I http://198.51.100.25
curl -vk https://198.51.100.25 2>&1 | head -n 40

getent ahosts kakde.eu | head
curl -vk https://kakde.eu 2>&1 | head -n 60
```

Also verify that blocked ports are not reachable:

```bash
nc -vz -w 3 198.51.100.25 6443
nc -vz -w 3 198.51.100.25 10250
nc -vz -w 3 198.51.100.25 30080
```

Good looks like:

* HTTP and HTTPS respond on the edge IP
* DNS resolves as expected
* Kubernetes-related ports are not reachable publicly.

---

## Validation checklist

A healthy end state looks like this:

* Traefik runs only on `ctb-edge-1`
* Traefik pod is `Running`
* the edge node listens on ports `80` and `443`
* the edge firewall allows only SSH, WireGuard, HTTP, and HTTPS publicly
* the older conflicting taint is removed
* there is no stuck Pending rollout pod
* port `9000` is no longer needed as part of the public path
* the cluster remains private behind the edge.

---

## Troubleshooting guide

### Problem 1: nftables syntax error

Symptom:

```text
unexpected junk ... iifname != 'eth0'
```

Cause:

* interface names were single-quoted instead of double-quoted

Fix:

* use `"eth0"` instead of `'eth0'`
* or apply the rules through `nft -f` as shown above.

---

### Problem 2: Traefik stuck in `Pending`

Symptom:

```text
0/4 nodes are available ... didn't match node affinity/selector ... untolerated taints
```

Cause encountered in this project:

* edge node had an extra taint: `homelab.kakde.eu/edge=true:NoSchedule`
* Traefik did not tolerate it

Fix:

* remove the old taint
* make sure only `ctb-edge-1` has `kakde.eu/edge=true`
* keep the intended taint `kakde.eu/edge=true:NoSchedule`.

---

### Problem 3: Traefik `CrashLoopBackOff`

Symptom:

* pod starts, then restarts repeatedly

Correct workflow:

* capture `describe pod`
* capture current logs
* capture previous logs
* only then decide the fix.

Final root cause found later:

```text
listen tcp :80: bind: permission denied
```

Fix:

* add `NET_BIND_SERVICE` to the container security context.

---

### Problem 4: rollout hangs with a second Pending pod

Symptom:

* a second Traefik pod stays Pending during rollout

Cause:

* host ports are already occupied by the old pod

Fix:

* set `maxSurge: 0`
* optionally delete the stuck Pending pod
* restart rollout.

---

### Problem 5: Ingress 404 after Traefik is running

This does not always mean Traefik is broken. The architecture notes explicitly say that a 404 can also come from route problems such as:

* wrong host in Ingress
* wrong service target
* wrong TLS secret
* overlay naming mismatch
* missing resource in the active overlay.

---

## Next steps

Once Traefik is stable, the next clean validation step is to deploy the `whoami` test application, expose it through a Kubernetes Ingress, and validate HTTP and HTTPS routing through the edge node. The architecture notes identify `whoami.kakde.eu` as the canonical simple validation app for ingress and TLS testing.

Typical next flow:

1. deploy `whoami`
2. expose it through a `ClusterIP` service
3. create an Ingress for `whoami.kakde.eu`
4. validate HTTP routing
5. validate TLS.

---

## Glossary

**K3s**
A lightweight Kubernetes distribution, good for small labs and simpler rebuilds.

**Calico**
The container networking layer used here instead of flannel. It provides pod networking and network policy.

**WireGuard**
The encrypted host-to-host overlay network connecting all four nodes.

**Ingress**
A Kubernetes object that defines how external HTTP or HTTPS traffic reaches internal services.

**Ingress controller**
The software that actually enforces Ingress routing. In this project, that is Traefik.

**hostNetwork**
A setting where the pod uses the host machine’s network namespace and can bind the host’s real ports directly.

**Privileged port**
A Linux port below `1024`, such as `80` or `443`, which often requires extra capability to bind.

**nftables**
The modern Linux firewall framework used for the edge guardrail.

**Label**
Metadata on a node or object, used for selection and scheduling.

**Taint**
A scheduling repellent on a node that blocks pods unless they explicitly tolerate it.
