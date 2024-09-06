## **⚖️ **MetalLB and NGINX Ingress****

---

## **🚀 **1. Install MetalLB****

- **Deploy MetalLB:**

    ```bash
    kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.8/config/manifests/metallb-native.yaml
    ```

- **Check the status:**
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

### **🛠️ **2. Configure MetalLB****

- **Create an IP address pool:**

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

- **Create an L2 Advertisement:**
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
          kubernetes.io/hostname: master-01.example.com
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

## **🌍 **Installing Nginx Ingress Controller Via Helm****

---

### **🚀 **1. Install Nginx Ingress Controller****

- **Add Nginx Ingress Controller's repository to Helm:**

  ```bash
  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
  helm repo update
  ```

- **Expected output:**
  ```text
  ...
  ...
  Update Complete. ⎈Happy Helming!⎈
  ```

- **Following command installs the Nginx Ingress Controller from the stable charts repository, names the Helm release
  nginx-ingress, and sets the publishService parameter to true.**
  ```bash
  helm install nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
  ```

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

- **Run this command to watch `-w` the Load Balancer become available:**

  ```bash
  kubectl --namespace default get services -o wide -w nginx-ingress-ingress-nginx-controller
  ```

- **After some time has passed, MetalLB will assign a External IP address to the Service automatically for newly created
  Load Balancer:**

  **Expected output:**
  ```text
  NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP     PORT(S)                      AGE     SELECTOR
  nginx-ingress-ingress-nginx-controller   LoadBalancer   10.43.8.169   172.16.100.11   80:31375/TCP,443:30567/TCP   5h55m   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
  ```

**When it is successful it means we are ready for our next steps.**

---

### **🔄 **2. Nginx as a Reverse Proxy on Cloud-VM****

- The main purpose of this setup is to forward HTTP and HTTPS traffic for the domain **example.com** to the LoadBalancer
  service, specifically the **nginx-ingress-ingress-nginx-controller**.
- **CloudVM’s Public IP** is used for this traffic forwarding.
- Make sure that in Cloudflare or your DNS provider, type `A` entry is added which points to public ip address of
  Cloud-VM.
- **Cloud-VM** serves as the entry point, and its IP is assigned in the DNS provider settings (using **Cloudflare**).
- Since **master-01** and **worker-01** don’t have dedicated public IPs, they are behind a **NAT (Network Address
  Translation)** provided by the ISP router.
- This means the public IP visible to the outside world is the router’s IP, not the IPs of **master-01** or **worker-01
  **.

- **First create a Nginx reverse proxy on cloud-vm:**

  ```bash
  dnf install nginx -y
  ```

- **Verify that the directory `/etc/nginx/sites-available` exists. If it does not, create it using the following
  command:**
  ```bash
  sudo mkdir -p /etc/nginx/sites-available
  ```

- **Next, create a file named `default` using the following command:**
  ```bash
  sudo tee /etc/nginx/sites-available/default <<EOF
  # NGINX reverse proxy configuration on cloud-vm
  
  server {
      listen 80;
      server_name example.com *.example.com;
  
      location / {
          proxy_pass http://172.16.100.11; # # Forward to LoadBalancer service `nginx-ingress-ingress-nginx-controller`.
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  
  server {
      listen 443 ssl;
      server_name example.com *.example.com;
  
      # These directives will simply forward the SSL traffic to the Ingress Controller without terminating it
      location / {
          proxy_pass http://172.16.100.11; # Forward to LoadBalancer service `nginx-ingress-ingress-nginx-controller`.
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  EOF
  ```

- **Then verify and reload nginx:**

  ```bash
  sudo nginx -t
  sudo systemctl nginx reload 
  ```

- **Create an Ingress resource to expose the Kuard application:**

  ```bash
  cat <<EOF > kuard-ingress.yaml
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: kuard-k8s-ingress
  spec:
    ingressClassName: nginx
    rules:
      - host: "kuard1.example.com"
        http:
          paths:
            - path: "/"
              pathType: Prefix
              backend:
                service:
                  name: kuard-k8s-first
                  port:
                    number: 80
  EOF
  ```

- **Roll out:**
  ```bash
  kubectl create -f kuard-ingress.yaml
  ```

---

**Check in your browsers incognito mode to access it:**

[http://kuard1.example.com](http://kuard1.example.com)

---