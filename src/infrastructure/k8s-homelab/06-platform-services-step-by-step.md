# Platform Services Step by Step

This guide starts after the base cluster is healthy.

In this phase, you will add the four platform layers that make the homelab feel complete:

- Traefik for ingress
- a firewall guardrail on the public edge node
- cert-manager for automatic TLS
- Argo CD for GitOps

When this phase is done, the cluster is no longer just private infrastructure. It becomes a platform that can publish applications safely and manage them from Git.

## What This Phase Produces

By the end of this phase, you should have:

- a `traefik` namespace with the ingress controller pinned to `ctb-edge-1`
- an active host firewall guardrail on the public edge node
- a `cert-manager` namespace with working Cloudflare-backed ClusterIssuers
- an `argocd` namespace with Argo CD pinned to `wk-2`
- a public Argo CD entry point at `https://argocd.kakde.eu`

## What This Phase Actually Changes

This phase changes both Kubernetes and the public edge host.

Inside Kubernetes, you create the Traefik ingress layer, install cert-manager and its ClusterIssuers, and then install Argo CD with the homelab-specific pinning and ingress behavior.

On the edge host, you make the public exposure model persistent. The firewall guardrail keeps loopback, established traffic, and internal interfaces open, allows public `80/tcp`, `443/tcp`, and `51820/udp`, limits `22/tcp` to your admin source IP, and blocks accidental public exposure of ports such as kubelet `10250`, Calico VXLAN, or NodePort ranges.

That is why this phase matters so much: it is the point where the cluster stops being merely reachable and becomes intentionally publishable.

## Inputs You Should Have Ready

Before you begin this phase, gather these values so you do not stop halfway through:

- the public IP or CIDR you will allow for SSH administration to `vm-1`
- the public edge IP address that DNS should point to
- a Cloudflare API token that can manage the required DNS zone
- DNS records for the public hosts you intend to expose through Traefik
- confirmation that `ctb-edge-1` and `vm-1` refer to the same edge machine in your environment

## Before You Begin

All Kubernetes commands in this document assume cluster-admin access. On `ms-1`, set:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
```

Verify the base cluster first:

```bash
kubectl get nodes -o wide
kubectl get pods -A
```

Continue only if:

- all four nodes are `Ready`
- Calico is healthy
- the edge node `ctb-edge-1` exists and is tainted with `kakde.eu/edge=true:NoSchedule`

## Step 1: Install Traefik on the Edge Node

Traefik is the public web entry point for the homelab. It should run only on the public edge node and should bind ports `80` and `443` there.

Why `hostNetwork: true`? Traefik needs to bind ports 80 and 443 directly on the edge host's public IP address. A regular Kubernetes Service (NodePort or LoadBalancer) would pick ephemeral or high-numbered ports, and there is no cloud load balancer in front of this node. `hostNetwork` lets Traefik own the host's real network stack so incoming HTTPS traffic hits the right process without any extra translation layer.

Apply the manifests in order. The numbered filenames reflect the dependency sequence:

```bash
kubectl apply -f k8s-cluster/platform/traefik/1-namespace.yaml
kubectl apply -f k8s-cluster/platform/traefik/2-serviceaccount.yaml
kubectl apply -f k8s-cluster/platform/traefik/3-clusterrole.yaml
kubectl apply -f k8s-cluster/platform/traefik/4-clusterrolebinding.yaml
kubectl apply -f k8s-cluster/platform/traefik/5-ingressclass.yaml
kubectl apply -f k8s-cluster/platform/traefik/6-deployment.yaml
kubectl apply -f k8s-cluster/platform/traefik/7-service.yaml
```

Then enforce the intended edge placement:

```bash
EDGE_NODE=ctb-edge-1 bash k8s-cluster/platform/traefik/edge-node-placement.sh
```

Verify:

```bash
kubectl get pods -n traefik -o wide
kubectl get deploy -n traefik traefik -o yaml | rg -n "hostNetwork|kakde.eu/edge|NoSchedule" -A3
```

Good looks like:

- the Traefik pod is running on `ctb-edge-1`
- the deployment uses `hostNetwork: true`
- the deployment tolerates the edge taint and selects the edge label

## Step 2: Apply the Edge Firewall Guardrail

The edge node is intentionally public, but it should still be boring from the internet. The goal is to allow only what the platform actually needs.

The recommended public posture is:

- `22/tcp` from your admin IP only
- `80/tcp`
- `443/tcp`
- `51820/udp`

Everything else should be blocked on the public interface.

### 1. Create the guardrail environment file on `vm-1`

SSH to the edge node and create `/etc/default/edge-guardrail`:

```bash
sudo tee /etc/default/edge-guardrail >/dev/null <<'EOF'
PUB_IF=eth0
ADMIN_IPV4_CIDR=203.0.113.50/32
# Optional:
# ADMIN_IPV6_CIDR=2001:db8::/128
EOF
```

Replace `ADMIN_IPV4_CIDR` with the public IP or CIDR you will use for SSH administration.

### 2. Install the firewall guardrail

Why a host-level firewall and not just Kubernetes NetworkPolicy? The firewall runs at the Linux kernel level, before any packet reaches Kubernetes. It protects against accidental public exposure of ports that are invisible to Kubernetes NetworkPolicy: the kubelet API (`10250`), Calico VXLAN (`4789`), the NodePort range (`30000-32767`), and the K3s API (`6443`). NetworkPolicy controls pod-to-pod traffic inside the cluster; the host firewall controls what the internet can reach on the machine itself.

The repo provides an nftables-based guardrail. Install it on `vm-1`:

```bash
sudo install -m 0755 k8s-cluster/platform/traefik/edge-guardrail.sh /usr/local/sbin/edge-guardrail.sh
sudo install -m 0644 k8s-cluster/platform/traefik/edge-guardrail.service /etc/systemd/system/edge-guardrail.service
sudo systemctl daemon-reload
sudo systemctl enable --now edge-guardrail.service
```

### 3. Verify from another machine

Do not rely on a self-scan from the edge node to its own public IP. Test from `ms-1` or from another external host instead.

From `ms-1`, check what is visible on the edge public IP:

```bash
nmap -Pn -sT -p 22,80,443,10250 198.51.100.25
nmap -Pn -sU -p 51820 198.51.100.25
```

Good looks like:

- `22/tcp` is reachable only from approved admin source IPs
- `80/tcp` and `443/tcp` are open
- `51820/udp` is open
- `10250/tcp` is not publicly reachable

## Step 3: Confirm Traefik Is Listening on the Right Ports

On `vm-1`, verify the actual listeners:

```bash
sudo ss -lntup | egrep ':(80|443|8080)\b|:51820\b'
```

What you should understand here:

- ports `80` and `443` should belong to Traefik
- `51820/udp` belongs to WireGuard
- Traefik may still expose its internal dashboard/API on `8080` locally
- the firewall guardrail is what keeps that extra port from being publicly reachable

That separation is important. Kubernetes and the host firewall are working together here.

## Step 4: Install cert-manager

cert-manager will request and renew TLS certificates for the public hosts. This design uses Cloudflare DNS-01 validation so certificates can be issued without opening extra inbound challenge ports.

Run:

```bash
bash k8s-cluster/platform/cert-manager/install-cert-manager.sh
```

This install path:

- creates the `cert-manager` namespace if needed
- installs chart version `v1.19.1`
- installs CRDs through Helm
- waits for the deployment to become ready

Verify:

```bash
kubectl get pods -n cert-manager
kubectl get crd | rg cert-manager
```

## Step 5: Create the Cloudflare Secret and ClusterIssuers

Create a real secret manifest for the Cloudflare API token. The value must be a token that can edit the DNS zone used by your public hosts.

```bash
cat >/tmp/cloudflare-api-token.secret.yaml <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-api-token
  namespace: cert-manager
type: Opaque
stringData:
  api-token: CHANGE_ME
EOF
```

Replace `CHANGE_ME`, then apply the secret and the two issuers:

```bash
kubectl apply -f /tmp/cloudflare-api-token.secret.yaml
kubectl apply -f k8s-cluster/platform/cert-manager/clusterissuer-staging.yaml
kubectl apply -f k8s-cluster/platform/cert-manager/clusterissuer-prod.yaml
```

Verify:

```bash
kubectl get secret -n cert-manager cloudflare-api-token
kubectl get clusterissuer
```

Expected issuers:

- `letsencrypt-staging-dns01`
- `letsencrypt-prod-dns01`

## Step 6: Install Argo CD

Argo CD turns the repository into the desired state for the cluster. In this homelab, it is intentionally pinned to `wk-2` so its placement is predictable and easy to reason about.

Install the pinned version:

```bash
bash k8s-cluster/platform/argocd/install-argocd.sh
```

This script uses server-side apply because Argo CD's CRDs are large enough to hit client-side annotation limits.

## Step 7: Apply the Cluster-Specific Argo CD Configuration

Now apply the homelab-specific behavior:

```bash
bash k8s-cluster/platform/argocd/configure-argocd.sh
```

This step does four important things:

- labels `wk-2` with `workload=argocd`
- pins Argo CD deployments and the application controller to that node
- disables Argo CD's internal TLS so Traefik can terminate HTTPS
- applies the Argo CD ingress and the current `Application` objects

Verify:

```bash
kubectl get pods -n argocd -o wide
kubectl get application -n argocd
kubectl get crd applicationsets.argoproj.io
kubectl get ingress -n argocd
```

Good looks like:

- Argo CD pods are healthy
- they are scheduled onto `wk-2`
- `applicationsets.argoproj.io` exists
- the ingress for `argocd.kakde.eu` exists

## Step 8: Confirm the Platform Entry Points

At this stage, the ingress and TLS platform should be ready for real applications.

The important public hosts should now map into the cluster through the edge node:

- `argocd.kakde.eu`
- `kakde.eu`
- `notebook.kakde.eu`
- `keycloak.kakde.eu` once Keycloak is installed in the next phase

Useful checks:

```bash
kubectl get ingress -A
kubectl get certificate,challenge,order -A
```

If a host is not getting a certificate, verify:

- DNS points to the edge public IP
- the matching ingress exists
- the referenced ClusterIssuer exists
- the Cloudflare API token is valid

## Final Verification Checklist

Before you move on to databases and apps, confirm the platform layer as a whole:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get pods -n traefik -o wide
kubectl get pods -n cert-manager
kubectl get pods -n argocd -o wide
kubectl get clusterissuer
kubectl get ingress -A
kubectl get application -n argocd
```

On `vm-1`, also check:

```bash
sudo ss -lntup | egrep ':(22|80|443|8080)\\b|:51820\\b'
sudo systemctl status edge-guardrail.service --no-pager
```

You are ready for the next phase when:

- Traefik is healthy on `ctb-edge-1`
- the edge firewall is active
- cert-manager pods and ClusterIssuers are healthy
- Argo CD pods are healthy on `wk-2`
- the `argocd.kakde.eu` ingress exists
- public DNS and TLS are behaving as expected

## Common Recovery Shortcut

If Argo CD later reports that `ApplicationSet` is missing and `argocd-applicationset-controller` is unhealthy, rerun:

```bash
bash k8s-cluster/platform/argocd/install-argocd.sh
bash k8s-cluster/platform/argocd/configure-argocd.sh
```

That refreshes the missing CRD and reapplies the cluster-specific Argo CD settings.

## What You Have Now

At this point you have:

- a single public ingress path
- a hardened edge node
- automatic certificate management
- GitOps control for the homelab applications

What you still do not have yet:

- the internal PostgreSQL service
- Keycloak
- the application data layer

Those come next.

## Next Step

Continue with [12. Data and Apps Step by Step](12-data-and-apps-step-by-step.md).
