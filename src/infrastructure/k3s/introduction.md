# Hybrid Kubernetes Cluster Setup with K3S, WireGuard, and AWS EC2 Reverse Proxy

## Overview
A lightweight hybrid Kubernetes cluster using **K3S**, secured by **WireGuard VPN**, and extended to the cloud via **AWS EC2** as a reverse proxy. Combines on-premises nodes with cloud resources for cost-efficiency and scalability.

### Key Features
- 🛠️ **3-Node Architecture**:
  - `master-01`: On-prem control plane (home network).
  - `worker-01`: On-prem worker node (home network).
  - `cloud-vm`: **(AWS EC2)** Cloud worker + reverse proxy.
- 🔐 **WireGuard VPN**: Encrypted full-mesh communication between all nodes.
- ☁️ **Hybrid Traffic Flow**: Public → AWS EC2 (NGINX reverse proxy) → WireGuard → Cluster.

---

## Prerequisites

### Infrastructure
- **Nodes**:
  - 2 on-prem machines (1 control-plane - 8GB RAM, 1 worker - 32GB RAM) with static LAN IPs.
  - 1 AWS EC2 instance (public IP, t2.micro).
- **OS**: AlmaLinux/Fedora/CentOS (consistent across nodes).
- **Network**:
  - Port forwarding (HTTP/HTTPS) to AWS EC2 instance.
  - Domain with DNS control (e.g., `kakde.eu`).

```admonish
Make sure to replace **kakde.eu** domain with your domain. 
```

### Tools
- `dnf` package manager
- `firewalld` (firewall config)
- `kubectl` & `helm` (auto-installed with K3S)

---

## Core Components

1. **WireGuard VPN**  
   Encrypted tunnel between all nodes. AWS EC2 acts as public entry point while keeping cluster traffic private.

2. **K3S**  
   Lightweight Kubernetes (<100MB binary) with embedded components (containerd, Flannel).

3. **Calico CNI**  
   Replaces Flannel for advanced network policies and pod networking.

4. **MetalLB**  
   Assigns external IPs to services in bare-metal/on-prem environments.

5. **NGINX Stack**:
   - **Ingress Controller**: Routes internal HTTP/S traffic
   - **Reverse Proxy (EC2)**: Public-facing proxy → WireGuard → Cluster

6. **Cert-Manager**  
   Auto-provisions Let's Encrypt TLS certs via DNS01 challenges.

7. **ArgoCD**  
   GitOps-driven continuous deployment.

---

## Architecture Flow

```plaintext
Public Internet
     ↓
[AWS EC2 Instance] ← WireGuard VPN → [On-Prem Nodes]
     |_ NGINX Reverse Proxy (TCP/80,443)
     |_ Cert-Manager Integration
     ↓
[K3S Cluster]
     |_ MetalLB (LoadBalancer IPs)
     |_ Calico (Network Policies)
     |_ ArgoCD (App Deployment)
```

**Security Note**: All cross-node communication (including EC2↔on-prem) uses WireGuard encryption. Only HTTP/HTTPS ports exposed publicly on EC2.


### 📊 Server Overview

Below is a snapshot of the infrastructure layout, showcasing the roles of each node, their IP addresses, and how they
fit into the broader architecture:

| **📛 Node Name**            | **🎭 Role**                 | **🔐 Private IP Address**           | **🛡️ WireGuard IP** | **🌍 Public IP Address** | **📝 Notes**                                    |
|-----------------------------|-----------------------------|-------------------------------------|----------------------|--------------------------|-------------------------------------------------|
| `master-01`                 | Master Node (Control Plane) | 192.168.5.3 (Private, ISP-assigned) | 10.0.0.1             | HOME_ROUTER_PUBLIC_IP    | Located behind the ISP home router              |
| `worker-01`                 | Worker Node                 | 192.168.5.4 (Private, ISP-assigned) | 10.0.1.1             | HOME_ROUTER_PUBLIC_IP    | Located behind the ISP home router              |
| `cloud-vm`                  | Worker Node                 | 10.0.2.1                            | 10.0.2.1             | CLOUD_VM_PUBLIC_IP       | Hosted on a cloud provider (e.g., DigitalOcean) |
| **Local Jumpbox Machine**   |
| `Local (Mac/Linux/Windows)` | NONE                        | 192.168.5.5 (Private, ISP-assigned) | **NONE**             |                          |                                                 |

(ISP = Internet Service Provider)

Follow the steps to get your lightweight, secure Kubernetes cluster up and running, ready to handle modern workloads! 🚀

---
