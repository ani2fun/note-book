# Data and Apps Step by Step

This guide adds the workload layer that turns the cluster into a useful platform.

In this phase, you will:

- deploy PostgreSQL as an internal data service
- deploy Keycloak as the identity service
- confirm the GitOps pattern for production apps
- understand how development and production overlays fit together

By the end, the homelab is not just hosting infrastructure. It is hosting applications with data, identity, and repeatable delivery.

## What This Phase Produces

This phase turns the platform into something workloads can actually use.

You should end with:

- PostgreSQL running internally in `databases-prod`
- Keycloak running in `identity`
- production apps managed through Argo CD
- development overlays that can be rendered manually when needed

## How The Workload Layer Fits Together

This phase is not just "apply some YAML." It adds the first real service dependencies in the homelab.

PostgreSQL is the internal data layer. It is stateful, it keeps durable storage, and it is intentionally reachable only from approved namespaces inside the cluster.

Keycloak is the identity layer. It depends on PostgreSQL, it follows the same ingress and TLS pattern as the public apps, and it is one of the first workloads where Kubernetes manifests alone are not the whole story because realm configuration must also be backed up.

The notebook and portfolio apps are the application layer. They stay separate from the platform services and use a base-plus-overlays model so production remains reviewable and Git-driven while development can still be rendered manually when you need it.

If you see older notes elsewhere in the docs mentioning `deploy/...`, treat those as historical references. The maintained app manifests now live under `k8s-cluster/apps/`, but the important thing to understand first is how the layers depend on each other.

## Before You Begin

Make sure the previous phase is complete:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes -o wide
kubectl get pods -n traefik
kubectl get pods -n cert-manager
kubectl get pods -n argocd
```

Continue only if:

- the cluster is healthy
- Traefik is running on the edge node
- cert-manager is ready
- Argo CD is healthy
- the app namespaces `apps-dev` and `apps-prod` already exist

Before you add the workload layer, make sure you already understand which services are meant to stay internal, which services are meant to be public, and which ones are meant to be Git-managed.

## Step 1: Install PostgreSQL

PostgreSQL is an internal-only service in this design. It should not be reachable from the internet and it should not run on the edge node.

### 1. Place PostgreSQL on `wk-1`

Apply the node label:

```bash
kubectl label node wk-1 kakde.eu/postgresql=true --overwrite
```

This gives the PostgreSQL StatefulSet a predictable home.

### 2. Label the namespaces that are allowed to use PostgreSQL

Apply these namespace labels:

```bash
kubectl label namespace apps-prod kakde.eu/postgresql-access=true --overwrite
kubectl label namespace apps-dev kakde.eu/postgresql-access=true --overwrite
kubectl label namespace identity kakde.eu/postgresql-access=true --overwrite
```

This matches the network policy used by the database. Namespaces without this label should not be able to reach the database service.

### 3. Prepare the PostgreSQL secret

Create a real secret manifest with your database passwords:

```bash
cat >/tmp/postgresql-secret.yaml <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: postgresql-auth
  namespace: databases-prod
type: Opaque
stringData:
  postgres-superuser-password: "CHANGE_ME_SUPERUSER_PASSWORD"
  app-db-name: "appdb"
  app-db-user: "appuser"
  app-db-password: "CHANGE_ME_APP_PASSWORD"
EOF
```

Replace the placeholder passwords before applying it.

### 4. Apply the PostgreSQL manifests in order

```bash
kubectl apply -f k8s-cluster/platform/postgresql/1-namespace.yaml
kubectl apply -f /tmp/postgresql-secret.yaml
kubectl apply -f k8s-cluster/platform/postgresql/3-init-configmap.yaml
kubectl apply -f k8s-cluster/platform/postgresql/4-services.yaml
kubectl apply -f k8s-cluster/platform/postgresql/5-networkpolicy.yaml
kubectl apply -f k8s-cluster/platform/postgresql/6-statefulset.yaml
```

### 5. Verify PostgreSQL

```bash
kubectl get pods -n databases-prod -o wide
kubectl get pvc -n databases-prod
kubectl get svc -n databases-prod
kubectl get networkpolicy -n databases-prod
```

Expected result:

- namespace: `databases-prod`
- image: `postgres:17.9`
- PVC size: `80Gi`
- internal service: `postgresql.databases-prod.svc.cluster.local:5432`

What to remember:

- this database is internal only
- its durable state lives in the PVC
- changing the Kubernetes Secret later does not automatically rotate existing PostgreSQL passwords inside the database

## Step 2: Install Keycloak

Keycloak gives the homelab an identity platform and a realistic authentication story for apps.

### 1. Create the namespace

```bash
kubectl apply -f k8s-cluster/apps/keycloak/1-namespace.yaml
```

### 2. Create the admin and database secrets

Create a real secrets manifest:

```bash
cat >/tmp/keycloak-secrets.yaml <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: keycloak-admin-secret
  namespace: identity
type: Opaque
stringData:
  username: CHANGE_ME_ADMIN_USERNAME
  password: CHANGE_ME_ADMIN_PASSWORD
---
apiVersion: v1
kind: Secret
metadata:
  name: keycloak-db-secret
  namespace: identity
type: Opaque
stringData:
  username: CHANGE_ME_DB_USERNAME
  password: CHANGE_ME_DB_PASSWORD
EOF
```

Replace the placeholders, then apply:

```bash
kubectl apply -f /tmp/keycloak-secrets.yaml
```

### 3. Create the Keycloak database and database role in PostgreSQL

The Kubernetes manifests assume the database already exists. Run SQL like this against the PostgreSQL instance:

```sql
CREATE ROLE CHANGE_ME_KEYCLOAK_DB_USER LOGIN PASSWORD 'CHANGE_ME_KEYCLOAK_DB_PASSWORD';
CREATE DATABASE keycloak OWNER CHANGE_ME_KEYCLOAK_DB_USER;
REVOKE ALL ON DATABASE keycloak FROM PUBLIC;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO CHANGE_ME_KEYCLOAK_DB_USER;
```

You can run that SQL through `psql` using your preferred internal access method, for example:

- `kubectl exec` into the PostgreSQL pod
- `kubectl port-forward` to the PostgreSQL service
- an SSH tunnel to `ms-1` plus a remote `kubectl port-forward`

### 4. Apply the Keycloak manifests

```bash
kubectl apply -f k8s-cluster/apps/keycloak/3-deployment.yaml
kubectl apply -f k8s-cluster/apps/keycloak/4-service.yaml
kubectl apply -f k8s-cluster/apps/keycloak/5-ingress.yaml
```

### 5. Verify Keycloak

```bash
kubectl get pods -n identity -o wide
kubectl get svc -n identity
kubectl get ingress -n identity
kubectl logs -n identity deploy/keycloak --tail=50
```

Expected result:

- namespace: `identity`
- image: `quay.io/keycloak/keycloak:26.5.5`
- host: `keycloak.kakde.eu`

Important limitation:

Kubernetes manifests do not fully capture the real Keycloak configuration. Realm exports, clients, roles, redirect URIs, and identity-provider configuration still need to be backed up from Keycloak itself.

## Step 2.5: Deploy whoami with OAuth2 Proxy

Before wiring authentication into real applications, it is worth proving that the entire Keycloak OIDC chain works end to end. The whoami service is a lightweight HTTP echo container that makes this easy to test.

This step deploys two ingress routes:

- `whoami.kakde.eu` — unprotected, verifies that basic ingress and TLS work
- `whoami-auth.kakde.eu` — protected by OAuth2 Proxy, verifies the full Keycloak OIDC redirect flow

Why test this way? If you skip this step and wire OIDC directly into a real app, a failure could be caused by the app, the proxy, Keycloak, the ingress, or the certificate. By testing with whoami first, you isolate the authentication plumbing from application logic.

### 1. Create a Keycloak client for OAuth2 Proxy

In the Keycloak admin console (`keycloak.kakde.eu`), create a new client in the `kakde` realm:

- **Client ID:** `whoami-oauth2-proxy`
- **Client Protocol:** openid-connect
- **Access Type:** confidential
- **Valid Redirect URIs:** `https://whoami-auth.kakde.eu/oauth2/callback`

Save the client and note the client secret from the Credentials tab. You will need it for the OAuth2 Proxy secret below.

### 2. Create the OAuth2 Proxy secret

```bash
cat >/tmp/whoami-oauth2-proxy-secret.yaml <<'EOF'
apiVersion: v1
kind: Secret
metadata:
  name: oauth2-proxy-secret
  namespace: apps-prod
type: Opaque
stringData:
  client-id: whoami-oauth2-proxy
  client-secret: CHANGE_ME_CLIENT_SECRET
  cookie-secret: CHANGE_ME_COOKIE_SECRET_32_BYTES
EOF
```

Generate the cookie secret with: `openssl rand -base64 32 | head -c 32`

Replace the placeholders and apply:

```bash
kubectl apply -f /tmp/whoami-oauth2-proxy-secret.yaml
```

### 3. Apply the whoami and OAuth2 Proxy manifests

```bash
kubectl apply -f k8s-cluster/apps/whoami/
```

### 4. Verify the OIDC chain

Test basic ingress (should return 200 with HTTP headers):

```bash
curl -sI https://whoami.kakde.eu
```

Test the authenticated route (should return 302 redirecting to Keycloak):

```bash
curl -sI https://whoami-auth.kakde.eu
```

If the unauthenticated `whoami.kakde.eu` returns 200 and `whoami-auth.kakde.eu` returns a 302 redirect to `keycloak.kakde.eu`, the full OIDC chain is working. Open `https://whoami-auth.kakde.eu` in a browser to complete the login flow and confirm that Keycloak issues a valid token.

## Step 3: Confirm the Production App Delivery Pattern

The homelab currently uses Argo CD to manage the production overlays for:

- portfolio
- notebook

Those applications are already defined as Argo CD `Application` objects, so if the previous phase completed correctly, Argo CD should already be reconciling them.

Verify:

```bash
kubectl get application -n argocd
kubectl get application -n argocd note-book -o yaml | grep -n "path:"
kubectl get application -n argocd portfolio-app -o yaml | grep -n "path:"
kubectl get pods -n apps-prod
kubectl get ingress -n apps-prod
```

Expected production hosts:

- portfolio: `kakde.eu`
- notebook: `notebook.kakde.eu`

## Step 4: Understand the Development Overlay Pattern

The platform separates reusable app configuration from environment-specific differences.

Each app follows this layout:

- `base/` for shared Kubernetes resources
- `overlays/dev/` for development-specific changes
- `overlays/prod/` for production-specific changes

In practice, that means:

- the base holds the common Deployment and Service
- the overlay chooses namespace, hostnames, and image tags
- Argo CD watches the production overlay

If you want to deploy a dev overlay manually, you can render and apply it yourself:

```bash
kubectl kustomize k8s-cluster/apps/portfolio/overlays/dev | kubectl apply -f -
kubectl kustomize k8s-cluster/apps/notebook/overlays/dev | kubectl apply -f -
```

Use that only when you intentionally want the development copy running in the cluster.

## Step 5: Follow the GitOps Workflow for Production Changes

For existing production apps, the workflow is:

1. update the production overlay in the repo
2. commit the change
3. let Argo CD reconcile it into the cluster

In the current repo layout, that usually means changing one of these files:

- `k8s-cluster/apps/notebook/overlays/prod/kustomization.yaml`
- `k8s-cluster/apps/portfolio/overlays/prod/kustomization.yaml`

Before you rely on Argo CD, confirm the matching `Application` still points at the repo path you expect. If an `Application` object still refers to an older `deploy/...` path, treat that as drift and correct it before calling the GitOps flow complete.

For a brand-new app:

1. copy an existing app layout such as `k8s-cluster/apps/notebook/` or `k8s-cluster/apps/portfolio/`
2. adapt the `base/` resources
3. create `dev` and `prod` overlays
4. add a matching Argo CD `Application` under `k8s-cluster/platform/argocd/applications/`
5. let Argo CD manage the production overlay

This keeps production changes reviewable and repeatable instead of becoming a series of manual `kubectl apply` commands.

## Final Verification Checklist

Before you call the platform complete, run:

```bash
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

kubectl get pods -n databases-prod -o wide
kubectl get pvc -n databases-prod
kubectl get networkpolicy -n databases-prod
kubectl get pods -n identity -o wide
kubectl get ingress -n identity
kubectl get application -n argocd
kubectl get pods -n apps-prod
kubectl get ingress -n apps-prod
```

You want to see:

- PostgreSQL healthy on `wk-1`
- Keycloak healthy in `identity`
- production apps present in `apps-prod`
- Argo CD still healthy after the new workload layer was added
- ingress objects present for the public services you expect

## What You Have Now

At this point the homelab includes:

- a private Kubernetes foundation
- public ingress and TLS
- GitOps
- an internal database
- an identity provider
- a repeatable application deployment pattern

That is the full platform.

## Next Step

Keep [16. Operate, Verify, and Recover](16-operations-and-recovery.md) nearby. That guide explains how to check the platform, troubleshoot issues, and recover the important pieces cleanly.
