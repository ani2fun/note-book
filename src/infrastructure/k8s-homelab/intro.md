
## Table of Contents

- [1. What this project is](#1-what-this-project-is)
- [2. Goals](#2-goals)
- [3. Final architecture](#3-final-architecture)
- [4. Nodes, roles, and network layout](#4-nodes-roles-and-network-layout)
- [5. Core design rules](#5-core-design-rules)
- [6. Prerequisites](#6-prerequisites)
- [7. Build order](#7-build-order)

## 1. What this project is

This project is a small hybrid homelab platform built from four Ubuntu machines:

- three machines live on the home network
- one machine lives on a public cloud provider
- all four machines are connected through WireGuard
- Kubernetes runs on top of that private overlay
- only the cloud edge node is allowed to accept public web traffic

In plain language, the goal is to build a private-by-default Kubernetes platform that can still publish selected websites safely to the internet.

This documentation combines:

- the platform overview
- the rebuild steps
- the operational runbook
- the main troubleshooting notes

So it can be used as a reference document for building your own homelab cluster.

---

## 2. Goals

This platform exists to solve a very practical problem:

A person wants to run applications at home, learn real infrastructure, and keep strong control over what is exposed to the internet.

The main goals are:

1. Build a repeatable homelab platform from scratch.
2. Keep internal systems private.
3. Expose only selected HTTP/HTTPS apps through one hardened public edge node.
4. Use encrypted node-to-node connectivity with WireGuard.
5. Run Kubernetes in a simple but real multi-node setup.
6. Use cert-manager and Cloudflare DNS-01 for TLS certificates.
7. Standardize app deployment with Kustomize.
8. Run PostgreSQL internally only, not on the public internet.
9. Make the platform understandable and maintainable for a beginner.

---

## 3. Final architecture

The final design looks like this:

```text
Internet
   |
   v
ctb-edge-1 (public cloud VM)
  - public IP
  - WireGuard peer
  - K3s agent
  - Traefik ingress
  - only intended public entrypoint
   |
   | encrypted WireGuard mesh
   |
   +----------------------+----------------------+-------------------+
   |                      |                      |
   v                      v                      v
 ms-1                  wk-1                   wk-2
(home LAN)            (home LAN)             (home LAN)
  - K3s server          - K3s agent            - K3s agent
  - kubectl admin       - workloads            - workloads
  - cluster anchor      - internal services    - internal services
```

Then, inside Kubernetes:

- **Calico VXLAN** provides pod networking
- **Traefik** handles public ingress only on the edge node
- **cert-manager** issues certificates
- **applications** run through Kustomize base/overlay patterns
- **PostgreSQL** runs as an internal-only stateful service

---

## 4. Nodes, roles, and network layout

### Nodes

| Hostname | Role | Location |
|---|---|---|
| `ms-1` | K3s server | Home LAN |
| `wk-1` | K3s worker | Home LAN |
| `wk-2` | K3s worker | Home LAN |
| `ctb-edge-1` | Public edge + K3s worker | Cloud VM |

### IP layout

| Item | Value |
|---|---|
| Home LAN | `192.168.15.0/24` |
| Home router | `192.168.15.1` |
| Home public WAN IP | `82.123.119.181` |
| `ms-1` LAN IP | `192.168.15.2` |
| `wk-1` LAN IP | `192.168.15.3` |
| `wk-2` LAN IP | `192.168.15.4` |
| `ctb-edge-1` public IP | `84.247.143.66` |
| WireGuard subnet | `172.27.15.0/24` |
| `wk-1` WG IP | `172.27.15.11/32` |
| `ms-1` WG IP | `172.27.15.12/32` |
| `wk-2` WG IP | `172.27.15.13/32` |
| `ctb-edge-1` WG IP | `172.27.15.31/32` |

### Router UDP forwards for WireGuard

The home router forwards:

- `82.123.119.181:51820 -> wk-1:51820`
- `82.123.119.181:51821 -> ms-1:51820`
- `82.123.119.181:51822 -> wk-2:51820`

### Public DNS

The project uses the `kakde.eu` domain.

Examples used by the platform:

- `whoami.kakde.eu`
- `dev.notebook.kakde.eu`
- `notebook.kakde.eu`

---

## 5. Core design rules

These rules explain how the platform should behave.

### 5.1 Only one public edge node

Only `ctb-edge-1` should accept public web traffic.

That means:

- public `80/tcp` and `443/tcp` should terminate only there
- internal services should stay private
- the home LAN nodes should not directly expose Kubernetes or databases to the internet

### 5.2 WireGuard first, Kubernetes second

The platform depends on the WireGuard mesh.

Kubernetes should be built **after** WireGuard works cleanly.

### 5.3 Calico replaces flannel

K3s normally ships with flannel networking.

This project disables flannel and uses **Calico VXLAN** instead.

Why:

- better control over networking
- support for Kubernetes NetworkPolicy
- cleaner multi-node behavior for this design

### 5.4 Traefik runs edge-only

Traefik should run only on `ctb-edge-1`.

This keeps public ingress simple and controlled.

### 5.5 PostgreSQL stays internal-only

The database is not meant to be public.

Access should happen through:

- Kubernetes internal networking
- `kubectl port-forward`
- SSH-assisted operator tunnels

### 5.6 Rebuild cleanly instead of patching drift forever

This project intentionally starts from a clean baseline when things get too messy.

That is why the documented build order begins with a full cleanup.

---

## 6. Prerequisites

### 6.1 Required access

Before starting, make sure the operator has:

- SSH access to all four nodes
- sudo or root on all four nodes
- access to change DNS for `kakde.eu`
- access to Cloudflare API token creation
- access to the home router for UDP forwards

### 6.2 Operating system assumptions

All nodes are assumed to be:

- Ubuntu 24.04

### 6.3 Required tools

A beginner operator should expect to use:

- `ssh`
- `curl`
- `ip`
- `ss`
- `wg`
- `systemctl`
- `kubectl`
- `helm`
- `nft`
- `nmap`
- `psql`

### 6.4 Safety requirement

Do **not** start destructive steps unless:

- every node is reachable
- SSH is working normally
- you know which node is which
- you can reconnect if one session breaks
- you have two SSH sessions open during firewall changes

---

## 7. Build order

Use this order for a full rebuild:

1. Safety checks
2. Clean the old environment
3. Rebuild WireGuard
4. Install K3s server and agents
5. Install Calico VXLAN
6. Deploy edge-only Traefik
7. Publish `whoami` and validate ingress
8. Install cert-manager and issue TLS certificates
9. Standardize app deployment with Kustomize
10. Deploy PostgreSQL internally
11. Harden public exposure on the edge node
12. Continue with real apps

---
