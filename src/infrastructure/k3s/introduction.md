## **🌐 Introduction**

---

The goal is to set up a lightweight Kubernetes cluster using **K3S**, with secure communication across nodes via *
*WireGuard VPN**, aimed for bare-metal or resource-constrained environments where you still want to enjoy the power and
flexibility of Kubernetes while experimenting and learning.

---

### 🌟Overview

- For the moment, in this setup there are three key nodes: **cloud-vm**, **master-01**, and **worker-01**.
- Both **master-01** and **worker-01** are behind a home ISP router, which gives them private IP addresses. These IPs
  can’t be accessed from the public internet, but the router itself has a public IP.
- To enable secure communication between these nodes, **WireGuard VPN** is used to create a secure mesh network,
  ensuring all traffic stays private and protected.
- The third node, **cloud-vm**, is the gateway for all external traffic. It’s hosted on a cloud provider (like Contabo
  or DigitalOcean) and has a public IP address, serving as the access point for traffic sent to **example.com** through
  Cloudflare. (Of course, replace **example.com** with your own domain name)
- All nodes are running on **💻 AlmaLinux 9.4**, an open source, solid, enterprise-grade OS that’s reliable and built for
  long-term use.

---

### 🛠️Technology Stack

- **[🔐 WireGuard VPN](https://www.wireguard.com)**:  
  Ensures encrypted communication between **master-01**, **worker-01**, and **cloud-vm** through a full mesh network.
  Each node connects directly with every other node, improving fault tolerance and security.

- **[🦾 K3s](https://docs.k3s.io/)**:  
  A lightweight Kubernetes distribution, perfect for environments with limited resources. It’s quick to set up, uses
  half the memory of regular Kubernetes, and is packaged in a binary under 100 MB.

- **[🌐 Calico CNI](https://docs.tigera.io/calico/latest/about/)**:  
  Handles pod communication and enforces network policies, ensuring secure and efficient traffic within the Kubernetes
  cluster.

- **[⚖️ MetalLB](https://metallb.universe.tf/)**:  
  Provides external IPs and load balancing for services running in your bare-metal Kubernetes cluster.

- **[🌍 NGINX Ingress Controller](https://docs.nginx.com/nginx-ingress-controller/overview/about/)**:  
  Manages external access to Kubernetes services by routing HTTP/HTTPS traffic. It works with **Cert-Manager** to
  automate SSL certificate issuance and renewal, keeping the traffic to your services secure.

- **[☁️ Cloudflare DNS](https://developers.cloudflare.com/dns/concepts/)**:  
  Directs traffic from the domain **example.com** to **cloud-vm**, which forwards it to the appropriate services in the
  Kubernetes cluster.

- **[🔄 NGINX on cloud-vm](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)**:  
  Acts as a reverse proxy, routing traffic from the public internet to the Kubernetes cluster over the WireGuard VPN.
  This ensures that all traffic is secure and properly directed to the right service.

- **🚀[ArgoCD]()**
  For continuous deployment

---

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
