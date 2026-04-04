# Infrastructure Documentation

The goal is simple: help a beginner go from four Ubuntu machines to a working Kubernetes homelab without having to reverse-engineer the repo first.

## Who This Documentation Is For

This documentation is written for someone who wants to rebuild, understand, or operate the homelab from the repository itself.

It assumes you are comfortable running shell commands and editing YAML, but it does not assume you already know how this particular homelab is organized.

## What You Need Before You Start

Before you follow the build path, make sure you already have:

- SSH access to four of your ubuntu server, e.g `ms-1`, `wk-1`, `wk-2`, and `vm-1`
- `sudo` or root privileges on each node
- a Cloudflare-managed DNS zone for the public hostnames
- a public cloud VM that acts as the edge node
- the ability to run cluster-admin commands from `ms-1`
- a working clone of this repository so the manifests and scripts below are available locally

## What The Build Actually Looks Like In Practice

This homelab is built in layers, and each layer changes the platform in a concrete way.

First, you turn four Ubuntu machines into one private network. That means installing WireGuard, generating node keys, creating `wg0.conf` on each machine, applying the `rp_filter` sysctl, and making the home router forward UDP `51820-51822` back to the three home nodes.

Second, you turn that private mesh into a Kubernetes foundation. `ms-1` becomes the K3s server, `wk-1`, `wk-2`, and the edge node join as agents, Calico replaces flannel, and labels plus taints define where edge, database, and GitOps workloads are allowed to run.

Third, you turn the cluster into a safe public platform. Traefik is pinned to the cloud edge node with `hostNetwork: true`, the edge firewall allows only the ports the platform truly needs, cert-manager uses Cloudflare DNS-01 for TLS, and Argo CD is pinned to `wk-2` so Git becomes the deployment path.

Finally, you add the workload layer. PostgreSQL stays internal on `wk-1`, Keycloak uses that database and follows the same ingress/TLS pattern as the public apps, and the notebook and portfolio apps follow a base-plus-overlays model so production stays GitOps-managed while dev remains an intentional manual path when needed.

The repository contains the manifests and scripts behind those layers, but the runbook is meant to make sense on its own. The docs should tell the story first, and the repo paths should only be implementation detail.

## Current Path vs Historical Notes

The primary learning path in this folder is current and repo-backed.

Some of the longer deep-dive documents were kept as historical references because they still explain useful debugging and design context. Those notes may preserve earlier path names or experiments that are no longer the preferred rebuild path.

If you see an older path such as `deploy/...`, prefer the current `k8s-cluster/...` tree and the main step-by-step guides in this introduction.

## Homelab Platform Overview

This homelab is a small but serious platform: three private home nodes, one public cloud edge node, and a clear rule that only the edge is exposed to the internet.

It is designed to be reproducible, understandable, and worth learning from. You are not just standing up Kubernetes for the sake of it. You are building a compact platform that teaches networking, cluster design, ingress, TLS, GitOps, data services, identity, and clean recovery habits in one place.

## What You Are Building

By following the main guides in order, you will build:

- a four-node Ubuntu 24.04 Kubernetes homelab
- a private WireGuard mesh between the home network and the cloud edge node
- a K3s cluster with Calico networking
- a single public ingress path through Traefik
- automatic TLS with cert-manager and Cloudflare DNS validation
- GitOps with Argo CD
- internal data and identity services with PostgreSQL and Keycloak
- production and development application deployment patterns

The end result is a platform where internal services stay private, public traffic enters through one controlled edge node, and the full environment can be rebuilt from documentation and version-controlled manifests.

## Why This Homelab Exists

This homelab exists for three practical reasons.

First, it gives you a real environment to learn from. Many home labs stop at "the cluster works." This one is meant to teach why the cluster works, how the parts depend on each other, and how to rebuild it confidently when something changes.

Second, it creates a safer exposure model than a typical home setup. Instead of publishing random services directly from the home network, the design puts one hardened cloud node in front of the cluster and keeps the rest of the platform private behind WireGuard.

Third, it forces good infrastructure habits early. You practice clear node roles, repeatable installation, controlled ingress, automated TLS, Git-driven deployments, and recovery-oriented thinking without needing a large cloud bill or an enterprise-sized platform team.

## Why This Design Is Useful

This design is useful because it balances realism with simplicity.

- It is realistic enough to teach production-style ideas such as isolated ingress, private networking, GitOps, and service boundaries.
- It is small enough that one person can understand the whole system end to end.
- It is opinionated enough that a beginner is not left guessing where services should run or how they should be exposed.
- It is practical enough to host real applications such as a portfolio site, a notebook app, and an identity provider.

Most importantly, it teaches a valuable lesson: good infrastructure is not only about getting software running. It is about making the platform easy to reason about, safe to change, and possible to rebuild.

## How To Use These Docs

Read the documents in this order:

1. [01. Platform Overview](./k8s-homelab/01-platform-overview.md)
   Use this next for the concrete architecture, node layout, reference settings, and design rules.

2. [02. Rebuild Cluster Step by Step](./k8s-homelab/02-rebuild-cluster-step-by-step.md)
   Build the private network and the Kubernetes cluster itself.

3. [06. Platform Services Step by Step](./k8s-homelab/06-platform-services-step-by-step.md)
   Install ingress, the edge firewall guardrail, TLS automation, and Argo CD.

4. [12. Data and Apps Step by Step](./k8s-homelab/12-data-and-apps-step-by-step.md)
   Add PostgreSQL, Keycloak, and the application delivery pattern used by the homelab.

5. [16. Operate, Verify, and Recover](./k8s-homelab/16-operations-and-recovery.md)
   Use this once the platform is running to check health, troubleshoot issues, and recover cleanly.

## Build Journey

You will implement the homelab in four stages:

1. Build the private network and Kubernetes cluster.
2. Add ingress, edge hardening, TLS, and GitOps.
3. Add PostgreSQL, Keycloak, and the application delivery pattern.
4. Learn how to verify, operate, and recover the platform safely.

That sequence matters. Each stage depends on the one before it.

## What Success Looks Like

At the end of the tutorial:

- all four nodes are connected over WireGuard
- K3s nodes are `Ready` and use WireGuard IPs internally
- Traefik serves public HTTP and HTTPS only from the edge node
- certificates are issued automatically through cert-manager
- Argo CD manages the production app overlays from Git
- PostgreSQL serves internal workloads only
- Keycloak is reachable through the same ingress and TLS pattern as the apps
- the platform can be checked and rebuilt without guesswork

## Important Note About Public IPs

The tutorial documentation uses documentation-safe example public IP ranges:

- home WAN / router public IP: `203.0.113.10`
- cloud edge public IP: `198.51.100.25`

Private LAN and WireGuard addresses match the actual platform layout because they are part of the cluster design.