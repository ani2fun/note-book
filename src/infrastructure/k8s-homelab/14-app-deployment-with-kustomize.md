# Application Deployment Runbook using Kustomize

> Current note
> This is a detailed historical deep dive. For the current Kustomize and app deployment flow, start with [01-platform-overview.md](01-platform-overview.md) and [12-data-and-apps-step-by-step.md](12-data-and-apps-step-by-step.md).
>
> Current repo note: the maintained app manifests now live under `k8s-cluster/apps/`. If you see older path names later in this document, translate them to the current tree before applying anything.

## Notebook app fix, dev/prod namespace split, TLS troubleshooting, portfolio app pattern, and reusable template

## Table of contents

1. [Overview](#overview)
2. [Key decisions and patterns](#key-decisions-made)
3. [Notebook app deployment](#notebook-app-final-corrected-design)
4. [Certificate troubleshooting](#production-certificate-failure-root-cause-and-fix)
5. [Portfolio app deployment](#portfolio-app-cleanup-and-final-deployment-pattern)
6. [Reusable app template](#reusable-golden-template-dummy-app-template)
7. [Troubleshooting guide](#operational-troubleshooting-guide)
8. [Lessons learned](#important-lessons-learned)
9. [Further learning](#official-and-high-quality-learning-links)

---

## Overview

The main focus of this document was:

* separating **dev** and **prod** cleanly
* resolving a **prod TLS certificate** issuance problem
* applying the same model to a **portfolio app**
* creating a **generic reusable template** for future apps
* preparing a clean operational path for later services like PostgreSQL
---

## What this document accomplished

By the end of the document, the deployment model was standardized like this:

* **dev** apps live in namespace `apps-dev`
* **prod** apps live in namespace `apps-prod`
* internal Kubernetes object names stay the same across environments
* the environment is distinguished by:

    * namespace
    * hostname
    * cert-manager issuer
    * optional replica count or image override
* **no `nameSuffix: -dev`**
* Traefik uses **Kubernetes Ingress**, not Traefik CRDs
* each Ingress in this cluster must include:

    * `spec.ingressClassName: traefik`
    * annotation `kubernetes.io/ingress.class: traefik`
    * annotation `traefik.ingress.kubernetes.io/router.tls: "true"`

The document also proved an important point: even though Kubernetes generally prefers `ingressClassName`, this particular cluster needed **both** the field and the older annotation for Traefik behavior to be reliable. Kubernetes documents `ingressClassName` as the newer mechanism, while older annotation-based behavior still exists in practice with some controllers and clusters. ([Kubernetes][1])

---

## Cluster context used throughout this document

The following cluster facts were treated as already true:

* 4 Ubuntu 24.04 nodes
* `ms-1` = K3s server
* `wk-1`, `wk-2`, `ctb-edge-1` = K3s agents
* Calico VXLAN networking
* WireGuard mesh between nodes
* Traefik runs only on `ctb-edge-1`
* cert-manager is installed and working
* domain = `kakde.eu`

Previously confirmed cluster-specific behavior:

* local edge testing must use:

```bash
curl -k --resolve host:443:127.0.0.1 https://host/
```

That matters because testing Traefik against `127.0.0.1` without the correct hostname can produce misleading 404 results.

---

## Key decisions made

### 1. Dev and prod must be separated by namespace

This was the biggest design correction.

Chosen pattern:

* dev namespace: `apps-dev`
* prod namespace: `apps-prod`

### 2. Internal names stay stable

Examples:

* Deployment name: `notebook-app`
* Service name: `notebook-app`
* Ingress name: `notebook-app`

The same naming is used in both environments.

### 3. No `nameSuffix: -dev`

This was removed because it caused confusing object name drift and backend mismatches.

### 4. Use Kustomize base + overlays

Chosen structure:

* `base/`
* `overlays/dev/`
* `overlays/prod/`

### 5. Use hostnames and issuers to distinguish environments

For notebook:

* dev host: `dev.notebook.kakde.eu`
* prod host: `notebook.kakde.eu`

For portfolio:

* dev host: `dev.kakde.eu`
* prod host: `kakde.eu`

### 6. Prod may scale differently

Example used in this document:

* notebook prod replicas = 2
* portfolio prod replicas = 2

---

## Why the original dev/prod approach caused trouble

At first, dev had a suffix-based naming model. That looked harmless, but it created a real problem.

A suffix like `-dev` can cause this type of drift:

* Deployment becomes `notebook-app-dev`
* Service becomes `notebook-app-dev`
* Ingress still points to `notebook-app`

When that happens, Traefik may not find the correct backend Service, or the Ingress and Service no longer refer to the same object.

Another problem appeared after the suffix was removed:

* dev and prod now both used names like `notebook-app`
* if both were deployed into the **same namespace**, one environment would overwrite the other

That led to the final decision:

* keep names stable
* separate environments by namespace

This is much easier to reason about.

---

## Final deployment pattern adopted in this document

For every new app:

* base contains the Deployment and Service
* dev overlay adds:

    * namespace `apps-dev`
    * dev hostname
    * staging cert issuer
* prod overlay adds:

    * namespace `apps-prod`
    * prod hostname
    * production cert issuer
    * optional replica increase

This is the final pattern to reuse going forward.

---

## Notebook app: final corrected design

The notebook app became the reference implementation.

### Final behavior

* internal name: `notebook-app`
* dev namespace: `apps-dev`
* prod namespace: `apps-prod`
* dev host: `dev.notebook.kakde.eu`
* prod host: `notebook.kakde.eu`
* dev TLS issuer: `letsencrypt-staging-dns01`
* prod TLS issuer: `letsencrypt-prod-dns01`

### Why this design is good

It avoids:

* suffix confusion
* Service/backend mismatch
* dev/prod overwriting each other
* environment-specific internal naming chaos

---

## Notebook app: exact file layout and manifest contents

## Directory layout

```text
notebook/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── dev/
    │   ├── ingress.yaml
    │   └── kustomization.yaml
    └── prod/
        ├── ingress.yaml
        └── kustomization.yaml
```

## `base/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: notebook-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: notebook-app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: notebook-app
    spec:
      terminationGracePeriodSeconds: 20
      containers:
        - name: notebook-app
          image: ani2fun/note-book:5f7face64c914bb16a1f334708833336413debd6
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: 3000
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 6
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
      securityContext:
        seccompProfile:
          type: RuntimeDefault
```

## `base/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: notebook-app
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: notebook-app
  ports:
    - name: http
      port: 80
      targetPort: 3000
      protocol: TCP
```

## `base/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

labels:
  - pairs:
      app.kubernetes.io/name: notebook-app
    includeSelectors: true
    includeTemplates: true

resources:
  - deployment.yaml
  - service.yaml
```

## `overlays/dev/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: apps-dev

resources:
  - ../../base
  - ingress.yaml

images:
  - name: ani2fun/note-book
    newName: ani2fun/note-book
    newTag: 5f7face64c914bb16a1f334708833336413debd6
```

## `overlays/dev/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: notebook-app
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging-dns01
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  rules:
    - host: dev.notebook.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: notebook-app
                port:
                  number: 80
  tls:
    - hosts:
        - dev.notebook.kakde.eu
      secretName: dev-notebook-kakde-eu-tls
```

## `overlays/prod/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: apps-prod

resources:
  - ../../base
  - ingress.yaml

patches:
  - patch: |-
      - op: replace
        path: /spec/replicas
        value: 2
    target:
      kind: Deployment
      name: notebook-app

images:
  - name: ani2fun/note-book
    newName: ani2fun/note-book
    newTag: 5f7face64c914bb16a1f334708833336413debd6
```

## `overlays/prod/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: notebook-app
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod-dns01
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  rules:
    - host: notebook.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: notebook-app
                port:
                  number: 80
  tls:
    - hosts:
        - notebook.kakde.eu
      secretName: notebook-kakde-eu-tls
```

---

## Notebook app: cleanup from old `apps` namespace

Before moving to the new namespace model, old notebook resources had to be deleted from the legacy `apps` namespace.

### Why this mattered

Old resources were still present under older names like:

* `notebook-app-dev`
* `notebook-app-ingress`

That caused stale certificates and stale routing objects to be recreated.

### Commands run on `ms-1`

First cleanup attempt:

```bash
kubectl -n apps delete ingress notebook-app --ignore-not-found=true
kubectl -n apps delete service notebook-app --ignore-not-found=true
kubectl -n apps delete deployment notebook-app --ignore-not-found=true
kubectl -n apps delete certificate dev-notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps delete certificate notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps delete secret dev-notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps delete secret notebook-kakde-eu-tls --ignore-not-found=true
```

Then the remaining old objects were found and deleted:

```bash
kubectl -n apps delete ingress notebook-app-ingress --ignore-not-found=true
kubectl -n apps delete service notebook-app-dev --ignore-not-found=true
kubectl -n apps delete deployment notebook-app-dev --ignore-not-found=true
kubectl -n apps delete certificate notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps delete secret notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps delete secret notebook-kakde-eu-tls-wpws5 --ignore-not-found=true
```

### Verification

```bash
kubectl -n apps get all,ingress,certificate,secret | grep notebook || echo "OK: no notebook resources left in apps"
```

### Good looks like

The expected final output was:

```bash
OK: no notebook resources left in apps
```

---

## Notebook app: create namespaces and deploy

## Step 1: create the namespaces

Run on `ms-1`:

```bash
kubectl create namespace apps-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace apps-prod --dry-run=client -o yaml | kubectl apply -f -
```

### What these commands do

* `kubectl create namespace ... --dry-run=client -o yaml` creates a namespace manifest without directly applying it
* `kubectl apply -f -` applies that manifest safely

### Verify

```bash
kubectl get ns apps-dev apps-prod
```

### Good looks like

Both namespaces should appear.

---

## Step 2: render manifests before applying

Run on `ms-1` from the notebook app directory:

```bash
kubectl kustomize overlays/dev
kubectl kustomize overlays/prod
```

`kubectl kustomize` builds final manifests from a Kustomize directory. Kubernetes documents this command and Kustomize workflow officially. ([Kubernetes][2])

### Why rendering first matters

It lets the operator inspect the final YAML before it touches the cluster.

### Things to check

For dev:

* all resources should show `namespace: apps-dev`
* host should be `dev.notebook.kakde.eu`

For prod:

* all resources should show `namespace: apps-prod`
* host should be `notebook.kakde.eu`
* replicas should be `2`

---

## Step 3: apply manifests

Run on `ms-1`:

```bash
kubectl apply -k overlays/dev
kubectl apply -k overlays/prod
```

### What these commands do

* `-k` means apply a Kustomize directory
* dev and prod are applied separately

### Verify rollout

```bash
kubectl -n apps-dev rollout status deploy/notebook-app --timeout=180s
kubectl -n apps-prod rollout status deploy/notebook-app --timeout=180s
```

### Good looks like

Each command should report successful rollout.

---

## Notebook app: verification steps

## Verify resources

Run on `ms-1`:

```bash
kubectl -n apps-dev get deploy,svc,ingress,certificate,secret
kubectl -n apps-prod get deploy,svc,ingress,certificate,secret
```

### Good looks like

Dev:

* deployment exists
* service exists
* ingress exists
* certificate becomes `True`
* secret exists

Prod:

* deployment exists with 2 replicas
* service exists
* ingress exists
* certificate becomes `True`
* secret exists

## Verify endpoints

```bash
kubectl -n apps-dev get endpoints notebook-app
kubectl -n apps-prod get endpoints notebook-app
```

### Good looks like

The Service should have endpoints. If it has none, the Service selector probably does not match the Pod labels.

## Verify the Ingress

```bash
kubectl -n apps-dev get ingress notebook-app -o yaml
kubectl -n apps-prod get ingress notebook-app -o yaml
```

### Check for these fields

```yaml
spec:
  ingressClassName: traefik
```

and:

```yaml
annotations:
  kubernetes.io/ingress.class: traefik
  traefik.ingress.kubernetes.io/router.tls: "true"
```

Traefik’s Kubernetes Ingress provider is documented officially by Traefik, and cert-manager documents the annotation-driven Ingress flow that creates Certificate resources from Ingress definitions. ([doc.traefik.io][3])

## Edge-node local verification

Run on `ctb-edge-1`:

### Dev

```bash
curl -k --resolve dev.notebook.kakde.eu:443:127.0.0.1 https://dev.notebook.kakde.eu/ -I
curl -k --resolve dev.notebook.kakde.eu:443:127.0.0.1 https://dev.notebook.kakde.eu/
```

### Prod

```bash
curl -k --resolve notebook.kakde.eu:443:127.0.0.1 https://notebook.kakde.eu/ -I
curl -k --resolve notebook.kakde.eu:443:127.0.0.1 https://notebook.kakde.eu/
```

### Good looks like

* not a Traefik 404
* HTTP headers return successfully
* the page comes from the notebook application

---

## Production certificate failure: root cause and fix

This was the most important troubleshooting event in the document.

## Symptom

Dev certificate succeeded, but prod certificate stayed `False`.

Dev:

* `dev-notebook-kakde-eu-tls` became ready

Prod:

* `notebook-kakde-eu-tls` stayed `False`

## Why this was significant

Because the app objects themselves were healthy:

* Deployment was healthy
* Service existed
* Ingress existed

That narrowed the problem to the certificate issuance path.

## Investigation commands used on `ms-1`

### Inspect the certificate

```bash
kubectl -n apps-prod describe certificate notebook-kakde-eu-tls
kubectl -n apps-prod get certificate notebook-kakde-eu-tls -o yaml
```

### Inspect cert-manager pipeline objects

```bash
kubectl -n apps-prod get certificaterequest,order,challenge
kubectl -n apps-prod describe certificaterequest
kubectl -n apps-prod describe order
kubectl -n apps-prod describe challenge
```

### Check the Ingress

```bash
kubectl -n apps-prod get ingress notebook-app -o yaml
```

### Check the issuer

```bash
kubectl get clusterissuer letsencrypt-prod-dns01 -o wide
kubectl describe clusterissuer letsencrypt-prod-dns01
```

### Check cert-manager logs

```bash
kubectl -n cert-manager logs deploy/cert-manager --tail=200 | egrep -i 'notebook|order|challenge|error|fail'
```

## Root cause found

The failure was **not** caused by Traefik, not by the notebook manifest layout, and not by the namespace split.

The issue was a **CAA-related certificate issuance failure** at Let’s Encrypt finalize time.

### In plain language

A CAA record is a DNS record that says which certificate authorities are allowed to issue TLS certificates for a domain. Cloudflare documents CAA records this way, and Let’s Encrypt’s ecosystem uses them during issuance checks. ([Cloudflare Docs][4])

The fix chosen in the document was to add a CAA record in Cloudflare allowing Let’s Encrypt.

## Cloudflare fix used

In the Cloudflare UI, the user did not see a raw field called `issue`. The correct Cloudflare mapping was:

* **Tag:** `Only allow specific hostnames`
* **CA domain name:** `letsencrypt.org`

The Cloudflare CAA docs explain that the dashboard asks for a CAA record type, name, tag, and CA domain. ([Cloudflare Docs][4])

### Choice used

At the zone root (`@`), add:

* Type: `CAA`
* Name: `@`
* Flags: `0`
* Tag: `Only allow specific hostnames`
* CA domain name: `letsencrypt.org`

Optional wildcard version:

* Type: `CAA`
* Name: `@`
* Flags: `0`
* Tag: `Only allow wildcards`
* CA domain name: `letsencrypt.org`

## Verify CAA from `ms-1`

```bash
apt-get update && apt-get install -y dnsutils

dig +short CAA kakde.eu @1.1.1.1
dig +short CAA notebook.kakde.eu @1.1.1.1
dig +short CAA kakde.eu @8.8.8.8
dig +short CAA notebook.kakde.eu @8.8.8.8
```

### Good looks like

The output should include:

```text
0 issue "letsencrypt.org"
```

## Retry certificate issuance cleanly

```bash
kubectl -n apps-prod delete order,certificaterequest,challenge --all --ignore-not-found=true
kubectl -n apps-prod delete certificate notebook-kakde-eu-tls --ignore-not-found=true
kubectl -n apps-prod delete secret notebook-kakde-eu-tls --ignore-not-found=true
kubectl apply -k overlays/prod
```

### Important kubectl lesson learned

This command failed:

```bash
kubectl -n apps-prod get certificate,certificaterequest,order,challenge,secret -w
```

because `kubectl get -w` watches only one resource type at a time.

### Correct watch method

```bash
watch -n 2 'kubectl -n apps-prod get certificate,certificaterequest,order,challenge,secret'
```

## Final success check

```bash
kubectl -n apps-prod get certificate,secret
kubectl -n apps-prod describe certificate notebook-kakde-eu-tls
```

### Good looks like

* certificate is `True`
* secret exists
* prod HTTPS works

### Edge verification

Run on `ctb-edge-1`:

```bash
curl -k --resolve notebook.kakde.eu:443:127.0.0.1 https://notebook.kakde.eu/ -I
curl -k --resolve notebook.kakde.eu:443:127.0.0.1 https://notebook.kakde.eu/
```

## Safety note

The document also noted that repeated failed certificate attempts can run into Let’s Encrypt failed-validation limits. Let’s Encrypt documents validation and rate-limit behavior officially. ([letsencrypt.org][5])

---

## Portfolio app: cleanup and final deployment pattern

After notebook was working, the same pattern was extended to a portfolio app.

## Goal

Deploy:

* dev URL: `dev.kakde.eu`
* prod URL: `kakde.eu`

with:

* internal name `portfolio-app`
* no public legacy objects left in `apps`
* prod replicas = 2

## Cleanup in `apps`

First inspect old resources:

```bash
kubectl -n apps get all,ingress,certificate,secret | grep -E 'portfolio|kakde-eu-tls|dev-kakde-eu-tls' || echo "OK: no portfolio resources found in apps"
```

This found at least one leftover:

* `secret/portfolio-app-tls`

Delete old portfolio items only:

```bash
kubectl -n apps delete secret portfolio-app-tls --ignore-not-found=true
kubectl -n apps delete ingress portfolio-app --ignore-not-found=true
kubectl -n apps delete ingress portfolio-app-ingress --ignore-not-found=true
kubectl -n apps delete service portfolio-app --ignore-not-found=true
kubectl -n apps delete deployment portfolio-app --ignore-not-found=true
kubectl -n apps delete certificate portfolio-app-tls --ignore-not-found=true
```

Verify:

```bash
kubectl -n apps get all,ingress,certificate,secret | grep portfolio || echo "OK: no portfolio resources left in apps"
```

## Final portfolio layout

```text
portfolio-app/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── dev/
    │   ├── ingress.yaml
    │   └── kustomization.yaml
    └── prod/
        ├── ingress.yaml
        └── kustomization.yaml
```

## Main differences from notebook

* dev hostname = `dev.kakde.eu`
* prod hostname = `kakde.eu`
* prod replicas = 2

## Important safety note

Because `kakde.eu` is the root domain, the portfolio prod Ingress becomes the main site for the entire public domain. Only one app should own that hostname at a time.

---

## Reusable golden template: `dummy-app-template`

At the end of the document, a generic template was created for future apps.

## Directory layout

```text
dummy-app-template/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
├── overlays/
│   ├── dev/
│   │   ├── ingress.yaml
│   │   └── kustomization.yaml
│   └── prod/
│       ├── ingress.yaml
│       └── kustomization.yaml
└── scripts/
    ├── render.sh
    ├── apply.sh
    ├── verify.sh
    └── cleanup-old-from-apps.sh
```

## Base deployment template

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dummy-app-template
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: dummy-app-template
  template:
    metadata:
      labels:
        app.kubernetes.io/name: dummy-app-template
    spec:
      terminationGracePeriodSeconds: 20
      containers:
        - name: dummy-app-template
          image: REPLACE_WITH_IMAGE
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: REPLACE_WITH_CONTAINER_PORT
          readinessProbe:
            httpGet:
              path: /
              port: REPLACE_WITH_CONTAINER_PORT
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 6
          resources:
            requests:
              cpu: 50m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
      securityContext:
        seccompProfile:
          type: RuntimeDefault
```

## Base service template

```yaml
apiVersion: v1
kind: Service
metadata:
  name: dummy-app-template
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: dummy-app-template
  ports:
    - name: http
      port: 80
      targetPort: REPLACE_WITH_CONTAINER_PORT
      protocol: TCP
```

## Base kustomization template

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

labels:
  - pairs:
      app.kubernetes.io/name: dummy-app-template
    includeSelectors: true
    includeTemplates: true

resources:
  - deployment.yaml
  - service.yaml
```

## Dev overlay template

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: apps-dev

resources:
  - ../../base
  - ingress.yaml
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dummy-app-template
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.tls: "true"
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    cert-manager.io/cluster-issuer: letsencrypt-staging-dns01
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - dev.dummy-app-template.kakde.eu
      secretName: dev-dummy-app-template-kakde-eu-tls
  rules:
    - host: dev.dummy-app-template.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: dummy-app-template
                port:
                  number: 80
```

## Prod overlay template

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: apps-prod

resources:
  - ../../base
  - ingress.yaml

patches:
  - patch: |-
      - op: replace
        path: /spec/replicas
        value: 2
    target:
      kind: Deployment
      name: dummy-app-template
```

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: dummy-app-template
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.tls: "true"
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    cert-manager.io/cluster-issuer: letsencrypt-prod-dns01
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - dummy-app-template.kakde.eu
      secretName: dummy-app-template-kakde-eu-tls
  rules:
    - host: dummy-app-template.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: dummy-app-template
                port:
                  number: 80
```

---

## Generic scripts for future app deployments

## `scripts/render.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== DEV RENDER ==="
kubectl kustomize overlays/dev

echo
echo "=== PROD RENDER ==="
kubectl kustomize overlays/prod
```

## `scripts/apply.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== APPLY DEV ==="
kubectl apply -k overlays/dev

echo
echo "=== APPLY PROD ==="
kubectl apply -k overlays/prod

echo
echo "=== ROLLOUT STATUS ==="
kubectl -n apps-dev rollout status deployment/dummy-app-template --timeout=180s
kubectl -n apps-prod rollout status deployment/dummy-app-template --timeout=180s
```

## `scripts/verify.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "=== DEV OBJECTS ==="
kubectl -n apps-dev get deploy,svc,ingress,certificate,secret | grep dummy-app-template || true

echo
echo "=== PROD OBJECTS ==="
kubectl -n apps-prod get deploy,svc,ingress,certificate,secret | grep dummy-app-template || true

echo
echo "=== DEV ENDPOINTS ==="
kubectl -n apps-dev get endpoints dummy-app-template

echo
echo "=== PROD ENDPOINTS ==="
kubectl -n apps-prod get endpoints dummy-app-template

echo
echo "=== DEV INGRESS ==="
kubectl -n apps-dev get ingress dummy-app-template -o yaml

echo
echo "=== PROD INGRESS ==="
kubectl -n apps-prod get ingress dummy-app-template -o yaml
```

## `scripts/cleanup-old-from-apps.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_NAME="dummy-app-template"

kubectl -n apps delete ingress "${APP_NAME}" --ignore-not-found=true
kubectl -n apps delete ingress "${APP_NAME}-ingress" --ignore-not-found=true

kubectl -n apps delete service "${APP_NAME}" --ignore-not-found=true
kubectl -n apps delete service "${APP_NAME}-dev" --ignore-not-found=true

kubectl -n apps delete deployment "${APP_NAME}" --ignore-not-found=true
kubectl -n apps delete deployment "${APP_NAME}-dev" --ignore-not-found=true

kubectl -n apps delete certificate "${APP_NAME}-kakde-eu-tls" --ignore-not-found=true
kubectl -n apps delete certificate "dev-${APP_NAME}-kakde-eu-tls" --ignore-not-found=true

kubectl -n apps delete secret "${APP_NAME}-kakde-eu-tls" --ignore-not-found=true
kubectl -n apps delete secret "dev-${APP_NAME}-kakde-eu-tls" --ignore-not-found=true

kubectl -n apps get all,ingress,certificate,secret | grep "${APP_NAME}" || echo "OK: no ${APP_NAME} resources left in apps"
```

---

## Operational troubleshooting guide

## 1. TLS secret is missing

Run on `ms-1`:

```bash
kubectl -n apps-dev get certificate,certificaterequest,order,challenge,secret
kubectl -n apps-prod get certificate,certificaterequest,order,challenge,secret
```

Then describe the certificate:

```bash
kubectl -n apps-dev describe certificate <tls-secret-name>
kubectl -n apps-prod describe certificate <tls-secret-name>
```

Check cert-manager logs:

```bash
kubectl -n cert-manager logs deploy/cert-manager --tail=200
```

## 2. Traefik returns 404

Inspect the Ingress:

```bash
kubectl -n apps-dev get ingress <app-name> -o yaml
kubectl -n apps-prod get ingress <app-name> -o yaml
```

Check for:

* `spec.ingressClassName: traefik`
* annotation `kubernetes.io/ingress.class: traefik`
* annotation `traefik.ingress.kubernetes.io/router.tls: "true"`

Then test on `ctb-edge-1`:

```bash
curl -k --resolve host:443:127.0.0.1 https://host/ -I
curl -k --resolve host:443:127.0.0.1 https://host/
```

## 3. Service/backend mismatch

Render manifests before applying:

```bash
kubectl kustomize overlays/dev
kubectl kustomize overlays/prod
```

Inspect live objects:

```bash
kubectl -n apps-dev get deploy,svc,ingress,endpoints
kubectl -n apps-prod get deploy,svc,ingress,endpoints
```

Make sure all these match:

* Deployment name
* Pod label
* Service selector
* Ingress backend Service name

## 4. No Service endpoints

Check labels:

```bash
kubectl -n apps-dev get pods --show-labels
kubectl -n apps-dev get svc <app-name> -o yaml
kubectl -n apps-prod get pods --show-labels
kubectl -n apps-prod get svc <app-name> -o yaml
```

## 5. Legacy `apps` namespace still contains old objects

Inspect:

```bash
kubectl -n apps get all,ingress,certificate,secret | grep <app-name>
```

Delete only the stale objects for that app.

## 6. CAA or DNS problem blocks certificate issuance

Verify CAA:

```bash
dig +short CAA kakde.eu @1.1.1.1
dig +short CAA <host> @1.1.1.1
```

If needed, check Cloudflare CAA configuration and retry certificate issuance after the record propagates. Cloudflare documents CAA creation steps directly, and cert-manager documents Certificate and Ingress-based issuance flows. ([Cloudflare Docs][4])

---

## Commands reference by machine

## Run on `ms-1`

Use `ms-1` for:

* `kubectl` operations
* Kustomize rendering
* namespace creation
* app deployment
* cert-manager inspection
* DNS verification with `dig`

Common commands:

```bash
kubectl kustomize overlays/dev
kubectl apply -k overlays/dev
kubectl -n apps-prod describe certificate notebook-kakde-eu-tls
dig +short CAA kakde.eu @1.1.1.1
```

## Run on `ctb-edge-1`

Use `ctb-edge-1` for local edge validation:

```bash
curl -k --resolve dev.notebook.kakde.eu:443:127.0.0.1 https://dev.notebook.kakde.eu/ -I
curl -k --resolve notebook.kakde.eu:443:127.0.0.1 https://notebook.kakde.eu/ -I
```

---

## Important lessons learned

1. **Do not use `nameSuffix: -dev`** in this cluster’s app pattern.
2. **Stable internal names are good**, but only if dev and prod live in different namespaces.
3. **Render first, apply second.**
4. **Old resources in `apps` can silently interfere** with newer deployments.
5. **A broken production certificate is not always a Kubernetes problem.**
6. **Cloudflare CAA settings can block Let’s Encrypt issuance even when manifests look correct.**
7. **Testing Traefik locally requires the correct hostname**, not just `127.0.0.1`.
8. **This cluster specifically needed both Ingress class mechanisms**:

    * `spec.ingressClassName`
    * `kubernetes.io/ingress.class`

---

## Contradictions, assumptions, and unresolved gaps

## Contradictions

### 1. Modern Kubernetes guidance vs cluster behavior

Kubernetes generally treats `ingressClassName` as the newer preferred mechanism, but this cluster still required the old annotation as well for Traefik routing to behave correctly. That is a real-world cluster-specific finding, not a theoretical best-practice contradiction. ([Kubernetes][6])

### 2. One namespace vs two namespaces

At first, stable internal names looked like enough. Later, it became clear that dev and prod cannot share the same names in the same namespace. Namespace split resolved the conflict.

## Assumptions

1. Portfolio app container port was treated as needing confirmation.
2. Notebook app image and port were already known from the rendered manifests.
3. `apps-dev` and `apps-prod` are the long-term application namespaces going forward.

## Unresolved gaps

1. The final portfolio manifests still needed the real image and confirmed port when this document ended.
2. Database deployment had not yet begun; only a prompt for the next document was prepared.
3. This document covers only the current document, not the earlier project history.

---

## Glossary

**K3s**
A lightweight Kubernetes distribution.

**Kubernetes**
A platform for running and managing containerized applications.

**Namespace**
A logical partition inside Kubernetes. It is used to separate environments or teams.

**Deployment**
A Kubernetes object that manages stateless Pods and rolling updates.

**Pod**
The smallest deployable Kubernetes unit. Usually contains one application container.

**Service**
A stable internal network endpoint for reaching Pods.

**ClusterIP Service**
An internal-only Service reachable from inside the cluster.

**Ingress**
A Kubernetes object used to route HTTP/HTTPS traffic to Services.

**Traefik**
The Ingress controller used in this cluster to receive web traffic and send it to the correct app.

**cert-manager**
A Kubernetes tool that automates certificate issuance and renewal.

**Certificate**
A cert-manager resource describing the desired TLS certificate.

**Secret**
A Kubernetes object used to store sensitive values, such as TLS material.

**Kustomize**
A way to build Kubernetes YAML from a common base plus environment-specific overlays. Kubernetes supports this through `kubectl kustomize` and `kubectl apply -k`. ([Kubernetes][2])

**CAA record**
A DNS record that declares which certificate authorities are allowed to issue certificates for a domain. Cloudflare documents this as part of its SSL/TLS and DNS guidance. ([Cloudflare Docs][4])

---

## Suggested next step

The next logical step prepared in the document was to deploy an **internal PostgreSQL instance** with:

* 80 GiB persistent storage
* no public exposure
* no Ingress
* no LoadBalancer
* no NodePort
* internal-only Kubernetes access

That work had not started yet in this document, but the prompt was already prepared for a follow-up conversation.

---

## Official and high-quality learning links

These are useful references for the concepts used in this document:

* **Kubernetes Ingress overview**: official Kubernetes docs on how Ingress works. ([Kubernetes][1])
* **Kubernetes Ingress controllers and `ingressClassName`**: official Kubernetes docs on controller behavior and class selection. ([Kubernetes][6])
* **`kubectl kustomize`**: official Kubernetes command reference. ([Kubernetes][2])
* **Kustomize workflow**: official Kubernetes task guide for declarative management using Kustomize. ([Kubernetes][7])
* **Traefik Kubernetes Ingress provider**: official Traefik documentation. ([doc.traefik.io][3])
* **cert-manager Certificate resource**: official cert-manager docs for how Certificate resources work. ([cert-manager][8])
* **cert-manager and Ingress annotations**: official cert-manager documentation for Ingress-driven certificate generation. ([cert-manager][9])
* **Cloudflare CAA records**: official Cloudflare docs showing how to create CAA records in the dashboard. ([Cloudflare Docs][4])
* **Cloudflare certificate authority reference**: Cloudflare explanation of CA-related SSL/TLS behavior. ([Cloudflare Docs][10])
* **Let’s Encrypt rate limits**: official documentation on validation and issuance limits. ([letsencrypt.org][5])

---

## Final summary

This document standardized the Homelab-0 application deployment model.

The final model is:

* one base
* two overlays
* dev in `apps-dev`
* prod in `apps-prod`
* no environment suffix in object names
* environment separation by namespace, hostname, and issuer
* Traefik Ingress with both class settings plus `router.tls=true`
* cert-manager-managed TLS
* Cloudflare CAA awareness for certificate troubleshooting

This is now the reference pattern for future internet-exposed apps in the cluster.

[1]: https://kubernetes.io/docs/concepts/services-networking/ingress/ "Ingress"
[2]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_kustomize/ "kubectl kustomize"
[3]: https://doc.traefik.io/traefik/providers/kubernetes-ingress/ "Traefik Kubernetes Ingress Documentation"
[4]: https://developers.cloudflare.com/ssl/edge-certificates/caa-records/ "Add CAA records · Cloudflare SSL/TLS docs"
[5]: https://letsencrypt.org/docs/rate-limits/ "Rate Limits"
[6]: https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/ "Ingress Controllers"
[7]: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/ "Declarative Management of Kubernetes Objects Using ..."
[8]: https://cert-manager.io/docs/usage/certificate/ "Certificate resource - cert-manager Documentation"
[9]: https://cert-manager.io/docs/usage/ingress/ "Annotated Ingress resource - cert-manager Documentation"
[10]: https://developers.cloudflare.com/ssl/reference/certificate-authorities/ "Certificate authorities - SSL/TLS"
