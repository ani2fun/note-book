# Operate, Verify, and Recover

This guide is the practical companion to the build tutorial.

Use it after the homelab is running to answer four questions:

- is the cluster healthy right now
- is the public edge exposing only what it should
- what should I do first when something breaks
- which data must be backed up outside Kubernetes

## Before You Change Anything

When the platform is already running, slow down before making changes.

Use this short routine first:

- confirm the current health state with `kubectl get nodes -o wide` and `kubectl get pods -A`
- identify which layer is actually failing before editing manifests
- snapshot the live state with `bash k8s-cluster/live-capture/collect-live-state.sh` if you are about to make structural changes
- change one layer at a time so recovery stays understandable

This keeps normal troubleshooting from turning into accidental drift.

## 1. Start With a Simple Health Check

Run these checks first from a machine with cluster-admin access:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get nodes -o wide
kubectl get pods -A
kubectl get ingress -A
kubectl get application -n argocd
kubectl get certificate,challenge,order -A
```

Pay attention to:

- nodes that are not `Ready`
- pods stuck in `Pending`, `CrashLoopBackOff`, or `ImagePullBackOff`
- missing ingresses or missing TLS secrets
- Argo CD applications that are not healthy or not synced

If the cluster looks unhealthy here, do not start changing manifests blindly. First identify whether the problem is:

- network and node health
- ingress and TLS
- GitOps
- data or identity services

## 2. Check the Public Exposure Model

The public edge should stay tightly controlled.

On `vm-1`, inspect the listening ports:

```bash
sudo ss -lntup
```

You should expect to see:

- `80/tcp`
- `443/tcp`
- `51820/udp`
- `22/tcp` for administration

The important detail is not only what is listening locally, but what is reachable from outside.

From `ms-1` or another external machine, verify the edge public IP:

```bash
nmap -Pn -sT -p 22,80,443,10250 198.51.100.25
nmap -Pn -sU -p 51820 198.51.100.25
```

Remember:

- Traefik may still bind its dashboard/API locally on `8080`
- the firewall guardrail is what prevents that port from being publicly reachable
- a self-scan from the edge node to its own public IP is not trustworthy enough for exposure testing

## 3. Recover the Platform in the Right Order

When the homelab is in trouble, recover the layers from the bottom up:

1. WireGuard connectivity
2. K3s node health
3. Calico
4. Traefik and the edge firewall guardrail
5. cert-manager and TLS
6. Argo CD
7. PostgreSQL
8. Keycloak
9. application workloads

This order matters. For example, there is no point debugging an app ingress before the edge, DNS, and cluster networking are healthy.

## Fast Triage By Layer

When you already know roughly which layer is failing, start with the shortest useful commands:

| Layer | First commands | Typical failures |
| --- | --- | --- |
| WireGuard / host network | `wg show`, `ip -br addr`, `ip route`, `systemctl status wg-quick@wg0` | missing tunnel, bad peer config, routing drift |
| K3s control plane / agents | `kubectl get nodes -o wide`, `systemctl status k3s`, `systemctl status k3s-agent` | node not ready, agent not joined, kubelet issues |
| Calico | `kubectl get pods -n calico-system`, `kubectl logs -n calico-system ds/calico-node --tail=50` | CNI not ready, pod networking broken |
| Traefik / edge host | `kubectl get pods -n traefik -o wide`, `sudo ss -lntup`, `sudo systemctl status edge-guardrail.service` | ingress pod down, wrong listeners, firewall inactive |
| cert-manager | `kubectl get certificate,challenge,order -A`, `kubectl logs -n cert-manager deploy/cert-manager --tail=100` | challenge stuck, issuer missing, bad DNS token |
| Argo CD | `kubectl get application -n argocd`, `kubectl get pods -n argocd -o wide` | app out of sync, missing CRD, pod crash |
| PostgreSQL | `kubectl get pods,pvc,svc -n databases-prod`, `kubectl logs -n databases-prod statefulset/postgresql` | pod restart, storage issue, auth mismatch |
| Keycloak | `kubectl get pods,svc,ingress -n identity`, `kubectl logs -n identity deploy/keycloak --tail=100` | DB login failure, ingress/TLS issue, bad secret |

## 4. Argo CD Recovery

If Argo CD looks unhealthy, start with:

```bash
kubectl get pods -n argocd -o wide
kubectl get application -n argocd
kubectl get crd applicationsets.argoproj.io
```

If `argocd-applicationset-controller` is crashing because `ApplicationSet` is missing, rerun the pinned install and the homelab-specific configuration:

```bash
bash k8s-cluster/platform/argocd/install-argocd.sh
bash k8s-cluster/platform/argocd/configure-argocd.sh
kubectl get pods -n argocd -o wide
```

That is the quickest clean recovery for the known missing-CRD failure.

## 5. PostgreSQL Recovery Basics

Start with these checks:

```bash
kubectl get pods -n databases-prod -o wide
kubectl get pvc -n databases-prod
kubectl get svc -n databases-prod
kubectl get networkpolicy -n databases-prod
kubectl logs -n databases-prod statefulset/postgresql
```

Important things to remember:

- the PVC holds the durable database data
- deleting the StatefulSet is not the same as deleting the data
- changing the Kubernetes Secret does not automatically rotate passwords that already exist inside PostgreSQL

If the pod is gone but the PVC still exists, be careful. That usually means the data may still be recoverable by restoring the workload cleanly.

## 6. Keycloak Recovery Basics

Start with:

```bash
kubectl get pods -n identity -o wide
kubectl get svc -n identity
kubectl get ingress -n identity
kubectl logs -n identity deploy/keycloak --tail=100
```

Check these common failure points:

- database credentials in `keycloak-db-secret`
- PostgreSQL connectivity to `postgresql.databases-prod.svc.cluster.local`
- ingress and TLS for `keycloak.kakde.eu`

The biggest operational limitation is still this:

Kubernetes manifests do not fully describe the real Keycloak state. Realm exports, clients, redirect URIs, and identity-provider settings must be backed up separately.

## 7. Refresh the Live State Capture

When the running environment has changed and you want a fresh snapshot, use:

```bash
bash k8s-cluster/live-capture/collect-live-state.sh
```

This is especially useful after:

- changing firewall rules
- adding or removing platform components
- making manual changes on a host
- repairing a live service and wanting the repo to catch up with reality

## 8. Backups That Matter Outside Git

Git is important, but it is not enough on its own.

The following backups still matter:

- PostgreSQL logical dumps
- Keycloak realm exports
- Cloudflare token and DNS records
- real secret values
- WireGuard private keys

If you lose those, the manifests alone will not fully recreate the live platform.

Store those backups outside the cluster and outside this repository. A Git checkout is a rebuild aid, not a full disaster-recovery system.

## 9. Known Cleanup Targets

The live cluster still contains a few leftovers that are not part of the clean rebuild path:

- namespace `apps` — created during the original test deployment (see doc 08) before the `apps-dev` / `apps-prod` namespace split was adopted. Contains an older `whoami` deployment.
- namespace `default` with a legacy `dev.notebook.kakde.eu` ingress — left over from early notebook development before the app was moved to its proper namespace.
- namespace `nettest` — a debugging namespace created during initial Calico network validation. Safe to remove once you are confident the CNI is healthy.

Treat those as cleanup candidates, not as part of the intended architecture.

## Maintenance Routine

For a small homelab, a simple repeatable routine is better than a complex ops process.

After important changes:

- confirm nodes, platform namespaces, and ingresses are healthy
- refresh the live-state capture if the running environment changed materially
- verify the edge public exposure model from another machine
- take or refresh backups if you changed PostgreSQL, Keycloak, secrets, or WireGuard

Periodically:

- check certificate expiry and cert-manager health
- review Argo CD sync status and unexpected drift
- clean up legacy namespaces or ingresses that are no longer part of the target architecture

## 10. Troubleshooting Rule of Thumb

When something looks wrong, use sources in this order:

1. current `kubectl` output
2. version-controlled manifests and scripts in `k8s-cluster/`
3. the main tutorial documents in `_docs/k8s-homelab/`
4. older deep-dive historical notes

That keeps you anchored to the current platform instead of old assumptions.
