# Personal Technical Knowledge Base

Curated guides and notes from open resources, literature, and hands-on experience.  
⚠️ **Note:** Some content may require validation/updates for your specific use case.

---

## Core Sections

### 1. Infrastructure Engineering  
**Hybrid Kubernetes Cluster Guide**:  
- **AWS EC2 Reverse Proxy**: Public entry point for cluster traffic  
- **Key Components**:  
  - WireGuard VPN (encrypted node communication)  
  - K3S lightweight Kubernetes  
  - MetalLB (on-prem load balancing)  
  - NGINX Stack (Ingress + EC2 reverse proxy)  
  - Cert-Manager (auto-TLS via Let's Encrypt)  
  - ArgoCD (GitOps deployment)  
- Includes troubleshooting for common WireGuard/K3S integration issues  

---

### 2. Computer Science Fundamentals  
**Essential Topics**:  
- Algorithm design/analysis  
- Data structure optimization  
- System architecture patterns  
- Concurrent programming  

---

## Structure Philosophy  
- **Modular Design**: Sections operate independently for easy updates  
- **Progressive Expansion**: New domains added as curated/validated  
- **Navigation**: Chapter-based organization with cross-linking  

Use the sidebar/index to explore topics. Contributions welcome via PRs.