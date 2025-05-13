## **⚖️ **MetalLB and NGINX Ingress controller****

---

### Why Use MetalLB?
- **Load Balancing**: In bare-metal or hybrid setups, there’s no cloud-provided load balancer. MetalLB fills this gap by assigning external IPs to services.
- **External Access**: Essential for exposing applications outside the cluster (e.g., via Ingress).

---

## **🚀 **1. Install MetalLB****

- **Deploy MetalLB:**

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.8/config/manifests/metallb-native.yaml
    ```

- **Why**: Deploys MetalLB’s controller (manages IP assignments) and speaker (advertises IPs) pods to enable load balancing.

- **Check the status of the metalb deployment:**
  ```bash
  kubectl -n metallb-system get svc
  kubectl -n metallb-system get pods
  kubectl api-resources | grep metallb
  ```

- **Expected output:**
  ```console
  NAME                      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
  metallb-webhook-service   ClusterIP   10.43.159.103   <none>        443/TCP   44h
  
  NAME                          READY   STATUS    RESTARTS   AGE
  controller-6dd967fdc7-hl5wj   1/1     Running   0          44h
  speaker-f4mn8                 1/1     Running   0          44h
  speaker-wfspw                 1/1     Running   0          44h
  speaker-zdqqj                 1/1     Running   0          44h
  
  bfdprofiles                                      metallb.io/v1beta1                true         BFDProfile
  bgpadvertisements                                metallb.io/v1beta1                true         BGPAdvertisement
  bgppeers                                         metallb.io/v1beta2                true         BGPPeer
  communities                                      metallb.io/v1beta1                true         Community
  ipaddresspools                                   metallb.io/v1beta1                true         IPAddressPool
  l2advertisements                                 metallb.io/v1beta1                true         L2Advertisement
  servicel2statuses                                metallb.io/v1beta1                true         ServiceL2Status
  ```

---

### **🛠️ **2. Configure Configure IP Address Pool using MetalLB****

- **Action**: Create a file named `first-pool.yaml` on `master-01`:
  ```yaml
  apiVersion: metallb.io/v1beta1
  kind: IPAddressPool
  metadata:
    name: first-pool
    namespace: metallb-system
  spec:
    addresses:
      - 172.16.100.10-172.16.100.20
  ```
  
- **Why**: Defines a range of IPs MetalLB can assign to `LoadBalancer` services, making them accessible externally.
- **Explanation**: Choose a range outside your VPN (`10.0.0.0/16`) and local network (e.g., `192.168.1.0/24`) to avoid conflicts.

- Quick way to create config in a single command:
  ```bash
  cat <<EOF > first-pool.yaml
  # first-pool.yaml
  apiVersion: metallb.io/v1beta1
  kind: IPAddressPool
  metadata:
    name: first-pool
    namespace: metallb-system
  spec:
    addresses:
      - 172.16.100.10-172.16.100.20
  EOF
  ```

- **Roll out the configuration:**

  ```bash
  kubectl create -f first-pool.yaml
  ```

---

### 3. **Create an L2 Advertisement:**
- **Action**: Create a file named `l2advertisement.yaml` on `master-01`:
  ```yaml
  apiVersion: metallb.io/v1beta1
  kind: L2Advertisement
  metadata:
    name: homelab-l2
    namespace: metallb-system
  spec:
    ipAddressPools:
      - first-pool
  ```

- **Why**: Configures MetalLB to advertise the IP pool using Layer 2 (ARP), suitable for local or VPN-connected networks.

- Quick way to create config in a single command: 
  ```bash
  cat <<EOF > l2advertisement.yaml
  # l2advertisement.yaml
  apiVersion: metallb.io/v1beta1
  kind: L2Advertisement
  metadata:
    name: homelab-l2
    namespace: metallb-system
  spec:
    ipAddressPools:
      - first-pool
  EOF
  ```

- **Roll out the L2 Advertisement:**

  ```bash
  kubectl create -f l2advertisement.yaml
  ```

### 4. **Check for the Metallb status:**

- **Verify if the MetalLB is working as expected. To test, create a service of type LoadBalancer::**

  ```bash
  cat <<EOF > kuard-k8s-first.yaml
  apiVersion: v1
  kind: Service
  metadata:
    name: kuard-k8s-first
  spec:
    type: LoadBalancer
    ports:
      - port: 80
        targetPort: 8080
        protocol: TCP
    selector:
      app: kuard-k8s-first
  ---
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: kuard-k8s-first
  spec:
    selector:
      matchLabels:
        app: kuard-k8s-first
    replicas: 1
    template:
      metadata:
        labels:
          app: kuard-k8s-first
      spec:
        containers:
          - name: kuard-container
            image: gcr.io/kuar-demo/kuard-amd64:1
            imagePullPolicy: Always
            ports:
              - containerPort: 8080
        nodeSelector:
          kubernetes.io/hostname: master-01.kakde.eu
  EOF
  ```

- **Roll out:**

  ```bash
  kubectl create -f kuard-k8s-first.yaml
  ```

- **Check services in default namespace**
  ```bash
  kubectl get svc -n default
  ```

- **Expected output for the service:**

  ```text
  [root@master-01 ~]# k get svc
  NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)                      AGE
  kubernetes                  ClusterIP      10.43.0.1       <none>          443/TCP                      47h
  kuard-k8s-first             LoadBalancer   10.43.8.169     172.16.100.10   80:31375/TCP,443:30567/TCP   5h46m
  ```

- **For `kuard-k8s-first` Service, there needs to External IP address assigned automatically by MetalLB.** It shows that
  MetalLB load balancer is working as expected.

---



## **5. 🌍 **Installing Nginx Ingress Controller Via Helm****

### Why Use NGINX Ingress?
- **Traffic Routing**: Directs external HTTP/HTTPS traffic to specific services based on hostnames or paths.
- **TLS Termination**: Works with Cert-Manager to secure connections, offloading SSL handling from applications

---

### Install Nginx Ingress Controller 🚀

#### 1. Add Helm Repository
- **Commands** (run on `master-01`):
  ```bash
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm repo update
  ```
- **Why**: Adds the NGINX Ingress Helm chart repository and updates it, preparing for installation.

- **Expected output:**
  ```text
  ...
  ...
  Update Complete. ⎈Happy Helming!⎈
  ```

#### 2. Install NGINX Ingress Controller
- **Command** (run on `master-01`):
  ```bash
  helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
  ```
- **Why**: Deploys the NGINX Ingress Controller, which processes `Ingress` resources to route traffic.
- **Explanation**: `publishService.enabled=true` allows the controller to expose its external IP via MetalLB.

- **Expected output of the install command:**

  ```text
  Output
  NAME: nginx-ingress
  LAST DEPLOYED: Mon Sep  2 11:40:28 2024
  NAMESPACE: default
  STATUS: deployed
  REVISION: 1
  TEST SUITE: None
  NOTES:
  ...
  ```

#### 3. Verify Installation
- **Command** (run on `master-01`):
  ```bash
  kubectl get services -namespace default -w nginx-ingress-ingress-nginx-controller
  ```
- **Why**: Monitors the service until MetalLB assigns an external IP (e.g., `172.16.100.11`), confirming it’s ready to receive traffic.

- **After some time has passed, MetalLB will assign a External IP address to the Service automatically for newly created Load Balancer:**
- **Expected output would be something similar as follows:**
  ```text
  NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE     SELECTOR
  nginx-ingress-ingress-nginx-controller   LoadBalancer   10.43.8.169   172.16.100.11   80:31375/TCP,443:30567/TCP   5h55m   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
  ```

**When it is successful it means we are ready for our next steps.**

---
