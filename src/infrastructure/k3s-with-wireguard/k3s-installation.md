## **🦾 **Installing K3S****

---

### **⚙️ 1. Install K3s on the `master-01` node (Control Plane)**

Here **k3s-resolv.conf**  is added for appropriate DNS Resolution:

- **Create and Edit `nano /etc/k3s-resolv.conf` with content of nameservers:**

    ```bash
    sudo tee /etc/k3s-resolv.conf <<EOF
    nameserver 8.8.8.8
    nameserver 1.1.1.1
    nameserver 8.8.4.4
    nameserver 1.0.0.1
    EOF
    ```

- **Install K3s:**

    ```bash
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
    --node-ip=10.0.0.1 \
    --flannel-backend=none \
    --disable-network-policy \
    --disable=traefik \
    --resolv-conf=/etc/k3s-resolv.conf \
    --tls-san=api.example.com \
    --tls-san=10.0.2.1 \
    --advertise-address=10.0.0.1" sh -
    ```

**Explanation of params:**

- --node-ip=10.0.0.1: The internal WireGuard IP for master-01.
- --flannel-backend=none: Disables Flannel since we will use Calico.
- --disable-network-policy: Disables the default network policy controller.
- --disable=traefik: Disables Traefik as NGINX Ingress Controller will be used.
- --resolv-conf=/etc/resolv.conf: Ensures proper DNS settings.
- --tls-san=api.example.com: Includes the API domain in the TLS SANs for secure access.
- --tls-san=10.0.2.1: Includes the internal IP of cloud-vm to allow secure internal access.
- --advertise-address=10.0.0.1: Advertises the internal IP of master-01 for the API server.

---

### **🎉 **When installation is successful**:**

- Export kubeconfig file which is stored at `/etc/rancher/k3s/k3s.yaml` to configure access to the Kubernetes cluster.
  ```bash
  echo 'export KUBECONFIG=/etc/rancher/k3s/k3s.yaml' >> ~/.bashrc
  source ~/.bashrc
  ```

- **If `kubectl` is not installed on the master-01 node then install it via:**
  
  ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  ```

- **Install kubectl: / [Installation documentation for `kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)**
  ```bash
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  ```

- **After installation, check that `master-01` is up and running as the control plane:**
  ```bash
  kubectl get nodes -o wide
  ```

- **Should See `NotReady` because we have not implemented yet CNI Policy:**
  ```console
  [root@master-01 ~]# nodes
  NAME                 STATUS     ROLES                  AGE     VERSION        INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                         KERNEL-VERSION                 CONTAINER-RUNTIME
  master-01.example.com   NotReady   control-plane,master   3m57s   v1.30.4+k3s1   10.0.0.1      <none>        AlmaLinux 9.4 (Seafoam Ocelot)   5.14.0-427.31.1.el9_4.x86_64   containerd://1.7.20-k3s1
  ```

### **🌐 Install Calico CNI on master-01**:

1. **Apply Calico Manifest:**

- **Since the node was `NotReady`, it needs to deploy Calico CNI to handle networking:**

  ```bash
  kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
  ```

---

2. **Install K3s on Worker Nodes****

- **First get the server token from the `master-01`:**

  ```bash
  cat /var/lib/rancher/k3s/server/node-token
  ```

- **Install K3s on `worker-01`:**

  ```bash
  curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.1:6443 K3S_TOKEN=<K3S_TOKEN> INSTALL_K3S_EXEC="agent \
  --node-ip=10.0.1.1 \
  --resolv-conf=/etc/k3s-resolv.conf" sh -
  ```

- **Install K3s on `cloud-vm`:**

  ```bash
  curl -sfL https://get.k3s.io | K3S_URL=https://10.0.0.1:6443 K3S_TOKEN=<K3S_TOKEN> INSTALL_K3S_EXEC="agent \
  --node-ip=10.0.2.1 \
  --resolv-conf=/etc/k3s-resolv.conf \
  --node-external-ip=185.230.138.134" sh -
  ```

- **Explanation of params:**

  - --node-ip=10.0.1.1: Internal IP for worker-01.
  - --node-ip=10.0.2.1: Internal IP for cloud-vm.
  - --node-external-ip=<CLOUD_VM_PUBLIC_IP>: Specifies the public IP for cloud-vm, ensuring it can serve external traffic.


- **Verify the cluster nodes:**

  ```bash
  kubectl get nodes -o wide
  ```

- **Expected output:**

  ```console
  NAME                 STATUS   ROLES                  AGE   VERSION        INTERNAL-IP   EXTERNAL-IP       OS-IMAGE                         KERNEL-VERSION                 CONTAINER-RUNTIME
  cloud-vm.example.com    Ready    <none>                 46h   v1.30.4+k3s1   10.0.2.1      185.230.138.134   AlmaLinux 9.4 (Seafoam Ocelot)   5.14.0-427.31.1.el9_4.x86_64   containerd://1.7.20-k3s1
  master-01.example.com   Ready    control-plane,master   46h   v1.30.4+k3s1   10.0.0.1      <none>            AlmaLinux 9.4 (Seafoam Ocelot)   5.14.0-427.31.1.el9_4.x86_64   containerd://1.7.20-k3s1
  worker-01.example.com   Ready    <none>                 46h   v1.30.4+k3s1   10.0.1.1      <none>            AlmaLinux 9.4 (Seafoam Ocelot)   5.14.0-427.31.1.el9_4.x86_64   containerd://1.7.20-k3s1
  ```

- **Verify Pods Working as expected:**

  ```bash
  kubectl get pods -o wide
  ```

---

### **Deploy and Test Pod Networking**

1. **Create a YAML File for Pod Deployment:**

- Add Taints to cloud-vm and worker-01

  ```bash
  kubectl label node cloud-vm.example.com type=cloud-vm
  kubectl label node worker-01.example.com type=worker-01
  ```

- Create a file named `netshoot-pods.yaml` with the following content:

  ```bash
  cat <<EOF > netshoot-pods.yaml
  apiVersion: v1
  kind: Pod
  metadata:
    name: netshoot-master-01-1
    labels:
      app: netshoot
  spec:
    containers:
    - name: netshoot
      image: nicolaka/netshoot
      command: ["/bin/sh", "-c", "sleep infinity"]
    nodeSelector:
      kubernetes.io/hostname: master-01.example.com
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: netshoot-worker-01-1
    labels:
      app: netshoot
  spec:
    containers:
    - name: netshoot
      image: nicolaka/netshoot
      command: ["/bin/sh", "-c", "sleep infinity"]
    nodeSelector:
      kubernetes.io/hostname: worker-01.example.com
  ---
  apiVersion: v1
  kind: Pod
  metadata:
    name: netshoot-cloud-vm-1
    labels:
      app: netshoot
  spec:
    containers:
    - name: netshoot
      image: nicolaka/netshoot
      command: ["/bin/sh", "-c", "sleep infinity"]
    nodeSelector:
      kubernetes.io/hostname: cloud-vm.example.com
  EOF
  ```

2. **Deploy the pods using the kubectl apply command:**

  ```bash
  kubectl apply -f netshoot-pods.yaml
  ```

3. **Verify Pod Deployment:**

  Ensure all pods are running:
  ```bash
  kubectl get pods -o wide
  ```


4. Check the connectivity between pods deployed on two different servers:

  ```bash
  kubectl exec -it netshoot-cloud-vm-1 -- ping -c 4 <POD_IP>  # Ping netshoot-master-01-1 from netshoot-cloud-vm-1
  kubectl exec -it netshoot-cloud-vm-1 -- ping -c 4 <POD_IP>  # Ping netshoot-worker-01-1 from netshoot-cloud-vm-1
  ```

Successful pings confirm that the networking is functioning correctly across all nodes.

---

#### **📘 **(Optional Read)****

**🔐 **Understanding and Configuring TLS SANs** (Subject Alternative Names)**

TLS SANs (Subject Alternative Names) are a critical component in securing your Kubernetes cluster, particularly when you plan to access the Kubernetes API server or other services externally using a domain name.

1. What are TLS SANs?

SANs are extensions to the X.509 specification that allow you to specify additional hostnames, IP addresses, or DNS names that should be included in the SSL/TLS certificate. When a client (e.g., kubectl, a browser, or another service) connects to a server, it checks whether the hostname or IP address it’s connecting to matches any of the SANs in the server’s certificate. If it doesn’t match, the connection is not considered secure.

**Why --tls-san=*.example.com is Not Ideal**
- Wildcard SAN Limitation: Including `--tls-san=*.example.com` might seem like it covers all subdomains, but it does not directly provide the precision needed for the API server. The API server needs to match the exact hostname or IP being accessed.
- Client Connections: When clients (e.g., kubectl) connect to api.example.com, they expect the certificate to have that specific hostname in the SANs, not a wildcard.

**Why are TLS SANs ?**

With cloud-vm being the entry point for external traffic and handling a domain like example.com, TLS SANs ensure that:
- Secure Access to Kubernetes API: If you plan to access the Kubernetes API externally using a domain name like api.example.com, this domain needs to be included in the SANs of the certificate used by the API server.
- Multiple Access Points: If your API server is accessible via multiple IPs, hostnames, or domain names (e.g., api.example.com, 10.0.0.1, etc.), all these should be covered by the SANs.
- Cert-Manager and Ingress: When Cert-Manager issues certificates for your services, it will create certificates with SANs that match the hostnames specified in your Ingress resources.

**SAN Configuration for K3s API Server**

Given current setup and the need for proper certificate management:
Use Specific SANs:
--tls-san=api.example.com: Includes the domain name you will use to access the API server. This ensures that when you access the API server via api.example.com, the certificate matches.
--tls-san=<CLOUD_VM_PUBLIC_IP>: Include the public IP of cloud-vm if you need to access the API server via IP.
--tls-san=10.0.2.1: Include the internal WireGuard IP if internal services or nodes access the API server using this IP.

---