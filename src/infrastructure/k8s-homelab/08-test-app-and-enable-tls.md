# Publish a Test App and Enable TLS

> Current note
> This is a historical validation runbook for the test app path. For the current platform setup, start with [01-platform-overview.md](01-platform-overview.md) and [06-platform-services-step-by-step.md](06-platform-services-step-by-step.md).

### Purpose

Before publishing real applications, first prove the ingress path using a tiny test app.

### 1. Deploy `whoami`

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl apply -f - <<'EOWHOAMI'
apiVersion: v1
kind: Namespace
metadata:
  name: apps
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whoami
  namespace: apps
spec:
  replicas: 1
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
        - name: whoami
          image: traefik/whoami:latest
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: whoami
  namespace: apps
spec:
  selector:
    app: whoami
  ports:
    - name: http
      port: 80
      targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: whoami
  namespace: apps
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
spec:
  ingressClassName: traefik
  rules:
    - host: whoami.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: whoami
                port:
                  number: 80
EOWHOAMI
```

Verify:

```bash
kubectl -n apps get deploy,po,svc,ingress -o wide
kubectl -n apps rollout status deploy/whoami
```

### 2. Validate routing from the edge node

Run on `ctb-edge-1`:

```bash
curl -sS -I -H 'Host: whoami.kakde.eu' http://127.0.0.1/
curl -sS -k -I -H 'Host: whoami.kakde.eu' https://127.0.0.1/
```

If HTTP works but HTTPS returns `404`, Traefik is alive but the TLS route is incomplete.

### 3. Fix the HTTPS route

Run on `ms-1`:

```bash
kubectl -n apps annotate ingress whoami \
  traefik.ingress.kubernetes.io/router.tls="true" \
  --overwrite

kubectl -n apps annotate ingress whoami \
  traefik.ingress.kubernetes.io/router.entrypoints="websecure" \
  --overwrite
```

Retest on `ctb-edge-1`:

```bash
curl -sS -k -I -H 'Host: whoami.kakde.eu' https://127.0.0.1/
curl -sS -k -H 'Host: whoami.kakde.eu' https://127.0.0.1/ | head
```

### 4. Install cert-manager

Run on `ms-1`:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

sudo apt-get update && sudo apt-get install -y helm

helm repo add jetstack https://charts.jetstack.io
helm repo update

kubectl create namespace cert-manager --dry-run=client -o yaml | kubectl apply -f -

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --set installCRDs=true
```

Verify:

```bash
kubectl -n cert-manager get pods
kubectl -n cert-manager rollout status deploy/cert-manager
kubectl -n cert-manager rollout status deploy/cert-manager-webhook
kubectl -n cert-manager rollout status deploy/cert-manager-cainjector
```

### 5. Create the Cloudflare API token secret

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

read -s CF_API_TOKEN
echo

kubectl -n cert-manager create secret generic cloudflare-api-token \
  --from-literal=api-token="$CF_API_TOKEN" \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n cert-manager get secret cloudflare-api-token
```

### 6. Create the production ClusterIssuer

```bash
kubectl apply -f - <<'EOISSUER'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod-dns01
spec:
  acme:
    email: a.r.kakde@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod-dns01-private-key
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-api-token
              key: api-token
EOISSUER

kubectl get clusterissuer
kubectl describe clusterissuer letsencrypt-prod-dns01 | sed -n '1,160p'
```

You should also create a staging issuer for testing.

### 7. Issue the certificate

```bash
kubectl -n apps apply -f - <<'EOCERT'
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: whoami-kakde-eu
  namespace: apps
spec:
  secretName: whoami-kakde-eu-tls
  issuerRef:
    name: letsencrypt-prod-dns01
    kind: ClusterIssuer
  dnsNames:
    - whoami.kakde.eu
EOCERT
```

Attach the secret to the Ingress:

```bash
kubectl -n apps patch ingress whoami --type='merge' -p '{
  "spec": {
    "tls": [
      {
        "hosts": ["whoami.kakde.eu"],
        "secretName": "whoami-kakde-eu-tls"
      }
    ]
  }
}'
```

Watch issuance:

```bash
kubectl -n apps get certificate,certificaterequest,order,challenge -o wide
kubectl -n apps describe certificate whoami-kakde-eu | sed -n '1,220p'
kubectl -n apps get secret whoami-kakde-eu-tls
```

### 8. Validate externally

From an external machine:

```bash
curl -sS -I --resolve whoami.kakde.eu:80:198.51.100.25 http://whoami.kakde.eu/
curl -sS -k -I --resolve whoami.kakde.eu:443:198.51.100.25 https://whoami.kakde.eu/
curl -sS -k --resolve whoami.kakde.eu:443:198.51.100.25 https://whoami.kakde.eu/ | head

curl -sS -I https://whoami.kakde.eu/
curl -sS https://whoami.kakde.eu/ | head
```

### Expected result

- HTTP redirects to HTTPS
- HTTPS works with a valid certificate
- `whoami` returns its normal diagnostic output

---
