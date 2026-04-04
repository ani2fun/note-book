# PostgreSQL: Beginner-Friendly Deployment and Operations Guide

> Current note
> This is a detailed historical deep dive. For the current data-service path, start with [01-platform-overview.md](01-platform-overview.md) and [12-data-and-apps-step-by-step.md](12-data-and-apps-step-by-step.md).

## Table of Contents

1. [Overview](#overview)
2. [What was built](#what-was-built)
3. [Design decisions](#why-this-design-was-chosen)
4. [Step-by-step deployment](#step-by-step-deployment)
5. [Manifest reference](#exact-manifest-files)
6. [Validation and testing](#validation-and-testing)
7. [Troubleshooting](#troubleshooting-that-happened-in-this-document)
8. [Connecting from a Mac](#how-to-connect-from-a-mac)
9. [Backup and restore](#backup-and-restore-basics)
10. [Further learning](#official-learning-links)

---

## Overview

This document explains how a single internal PostgreSQL database was deployed into the Homelab-0 K3s cluster, how it was debugged when startup failed, how it was verified, and how it can be accessed safely from a local Mac.

The audience for this document is a beginner. That means the guide explains not just **what** to run, but also **why** each step exists and what success looks like.

The manifest set includes a namespace, secret, bootstrap ConfigMap, services, network policies, and a StatefulSet with an 80Gi persistent volume.

---

## What was built

A single PostgreSQL instance was deployed for **internal Kubernetes use only**.

The final solution has these characteristics:

* Namespace: `databases-prod`
* One PostgreSQL pod managed by a StatefulSet named `postgresql`
* Persistent storage: `80Gi` on the `local-path` storage class
* Internal-only access through a `ClusterIP` Service named `postgresql`
* No Ingress
* No NodePort
* No LoadBalancer
* Credentials stored in a Kubernetes Secret
* A bootstrap script stored in a ConfigMap to create an application database and application user on first initialization
* NetworkPolicy rules that deny general ingress and only allow traffic from approved namespaces
* Placement constrained to a node labeled `kakde.eu/postgresql=true`

The final runtime behavior was successfully validated:

* the pod became healthy
* the application database `appdb` was created
* the application user `appuser` could connect
* a write/read test succeeded
* the service and EndpointSlices pointed to the running pod

---

## Why this design was chosen

### Why a StatefulSet?

PostgreSQL is a **stateful** application. That means it stores important data on disk and needs stable identity and stable storage. In Kubernetes, a StatefulSet is the standard workload type for this kind of application because it provides sticky pod identity and persistent volume handling. ([Kubernetes][1])

### Why a `ClusterIP` Service?

A `ClusterIP` Service is internal to the cluster. It is the default and safest way to expose a database to other pods without exposing it outside the cluster. That fits this use case because PostgreSQL should not be internet-facing. ([Kubernetes][2])

### Why `local-path` storage?

K3s includes the Rancher Local Path Provisioner out of the box. It is simple and works well for a small homelab, but it uses storage local to the node that runs the pod. That means the database is tied to that node’s disk. This is acceptable for a simple, single-instance homelab database, but it increases the importance of backups. ([docs.k3s.io][3])

### Why NetworkPolicy?

NetworkPolicy is used to reduce the blast radius inside the cluster. Even though the service is internal-only, not every namespace should be allowed to talk to the database. The chosen policy denies ingress by default and explicitly allows only:

* the same namespace `databases-prod`
* other namespaces labeled `kakde.eu/postgresql-access=true`

Kubernetes NetworkPolicies are designed for exactly this kind of traffic restriction between workloads. ([Kubernetes][4])

---

## Final architecture

### Cluster context

It is assumed this existing cluster context:

* 4 Ubuntu 24.04 nodes
* `ms-1` = K3s server
* `wk-1`, `wk-2`, `ctb-edge-1` = agents
* Calico VXLAN for CNI
* WireGuard mesh between nodes
* Traefik only on the edge node for public HTTP/HTTPS apps
* cert-manager already installed and working

### PostgreSQL placement

The database pod is pinned to a node with label:

```yaml
kakde.eu/postgresql: "true"
```

In practice, the chosen node was `wk-1`.

This keeps the database away from the public edge node and avoids mixing it with the public-facing ingress role.

### Access model

There are two services:

1. `postgresql-hl`
   A **headless service** used by the StatefulSet

2. `postgresql`
   A regular **ClusterIP service** used by clients inside Kubernetes

The client connection inside the cluster uses:

* Host: `postgresql.databases-prod.svc.cluster.local`
* Port: `5432`

### Credentials

Two kinds of credentials exist:

* PostgreSQL superuser/admin account
* Application account

The final secret uses these keys:

* `postgres-superuser-password`
* `app-db-name`
* `app-db-user`
* `app-db-password`

The PostgreSQL superuser username is:

```text
postgres
```

That comes from `POSTGRES_USER: postgres` in the StatefulSet.

---

## Files used in the deployment

The final file layout is:

* `1-namespace.yaml` — namespace creation
* `2-secret.yaml` — credentials
* `3-init-configmap.yaml` — bootstrap script for first initialization
* `4-services.yaml` — internal service definitions
* `5-networkpolicy.yaml` — ingress restrictions
* `6-statefulset.yaml` — PostgreSQL workload and persistent volume claim template

---

## Important decisions and lessons learned

### 1. The first hardening attempt was too strict

An early version of the StatefulSet included a container `securityContext` that dropped all Linux capabilities and also set `fsGroup`. That caused the PostgreSQL container to fail during first boot with errors like:

* `chmod: changing permissions of '/var/run/postgresql': Operation not permitted`
* `chown: changing ownership of '/var/lib/postgresql/data/pgdata': Operation not permitted`

The fix was to remove:

* pod `fsGroup`
* pod `fsGroupChangePolicy`
* container `securityContext` that dropped all capabilities

The final working manifest keeps only:

```yaml
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

at the pod level.

### 2. The bootstrap script only matters on first initialization

The bootstrap ConfigMap creates the application role and application database on **first initialization of the data directory**. If the PVC already contains a PostgreSQL data directory, changing the ConfigMap or Secret later does not recreate the database automatically. That behavior matches the PostgreSQL container’s first-init model. The application setup in this document relied on `/docker-entrypoint-initdb.d` for first-run initialization.

### 3. Secret changes do not automatically change the live PostgreSQL password

The Secret is only a Kubernetes object. PostgreSQL stores the actual role password internally in the database. That means:

* changing `app-db-password` in the Secret does **not** rotate the database user password by itself
* an explicit SQL command like `ALTER ROLE ... PASSWORD ...` is needed after a password rotation

### 4. Mac access should stay temporary and private

The database should remain internal-only. The safest temporary access method from a Mac is:

* Kubernetes `port-forward`
* or SSH plus a remote `kubectl port-forward`

No public exposure was added.

### 5. A subtle command syntax issue caused confusion

This command was wrong:

```bash
kubectl -n databases-prod port-forward svc/postgresql 127.0.0.1:15432:5432
```

Why it was wrong: `kubectl port-forward` does not accept the bind address inside the port tuple. Kubernetes interpreted `127.0.0.1` as if it were a port name.

The correct form is:

```bash
kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432
```

### 6. `ssh -N` is not appropriate when a remote command must run

This command failed:

```bash
ssh -N -L 15432:127.0.0.1:15432 root@192.168.15.2 'kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432'
```

Because `-N` means “do not execute a remote command or shell.” In this use case, the remote command **is required**.

The working one-liner was:

```bash
ssh -L 15432:127.0.0.1:15432 root@192.168.15.2 \
  'kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432'
```

---

## Step-by-step deployment

## Prerequisites

Before applying the manifests, make sure:

* the target node has enough free disk space for `80Gi`
* the target node is labeled for PostgreSQL
* the application namespace is labeled to allow DB access
* the secret file has real passwords, not placeholders

### Where to run the commands

All Kubernetes commands below should be run on a machine that has working `kubectl` access to the cluster. In this document, that machine was `ms-1`.

---

### Step 1: label the database node

Run on `ms-1`:

```bash
kubectl label node wk-1 kakde.eu/postgresql=true --overwrite
kubectl get nodes --show-labels | grep 'kakde.eu/postgresql=true'
```

What this does:

* adds a label to `wk-1`
* allows the StatefulSet to target that node using `nodeSelector`

Good looks like:

* only `wk-1` shows `kakde.eu/postgresql=true`

---

### Step 2: label the consuming application namespace

Run on `ms-1`:

```bash
kubectl label namespace apps-prod kakde.eu/postgresql-access=true --overwrite
kubectl get ns --show-labels | grep apps-prod
```

What this does:

* marks `apps-prod` as allowed by the NetworkPolicy

Good looks like:

* `apps-prod` shows `kakde.eu/postgresql-access=true`

---

### Step 3: verify the final manifest files

Run on `ms-1` from the manifest directory:

```bash
cd ~/deployment/postgresql
ls -1
```

Good looks like:

* the directory contains `1-namespace.yaml` through `6-statefulset.yaml`

---

### Step 4: edit the secret values

Run on `ms-1`:

```bash
sed -n '1,120p' 2-secret.yaml
```

The final file contains placeholders for:

* `SUPER_USER_PASSWORD`
* `APP_USER_PASSWORD`

Replace them with real values before applying.

---

### Step 5: apply the manifests

Run on `ms-1`:

```bash
cd ~/deployment/postgresql

kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-secret.yaml
kubectl apply -f 3-init-configmap.yaml
kubectl apply -f 4-services.yaml
kubectl apply -f 5-networkpolicy.yaml
kubectl apply -f 6-statefulset.yaml
```

What this does:

* creates the namespace
* stores credentials
* stores the first-run bootstrap script
* creates internal services
* creates the network restrictions
* creates the PostgreSQL StatefulSet and its PVC

Good looks like:

* each resource shows `created` or `configured`

---

### Step 6: watch the rollout

Run on `ms-1`:

```bash
kubectl -n databases-prod get statefulset
kubectl -n databases-prod get pods -w
```

Good looks like:

* `postgresql` StatefulSet exists
* pod `postgresql-0` reaches `Running`
* eventually the pod becomes `1/1 Ready`

---

### Step 7: verify the PVC and placement

Run on `ms-1`:

```bash
kubectl -n databases-prod get pvc
kubectl -n databases-prod get pod postgresql-0 -o wide
kubectl -n databases-prod describe pod postgresql-0 | egrep 'Node:|Image:|Mounts:'
```

What this does:

* checks that storage was provisioned
* verifies which node runs the pod
* verifies the image and mounts

Good looks like:

* `data-postgresql-0` is `Bound`
* pod is on `wk-1`
* image is `postgres:17.9`

---

## Exact manifest files

These are the final corrected manifests. The structure and values below match the manifest set under `k8s-cluster/platform/postgresql/`.

### `1-namespace.yaml`

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: databases-prod
```

### `2-secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: postgresql-auth
  namespace: databases-prod
type: Opaque
stringData:
  postgres-superuser-password: "SUPER_USER_PASSWORD"
  app-db-name: "appdb"
  app-db-user: "appuser"
  app-db-password: "APP_USER_PASSWORD"
```

### `3-init-configmap.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgresql-init
  namespace: databases-prod
data:
  01-create-app-db.sh: |
    #!/bin/sh
    set -eu

    export PGPASSWORD="${POSTGRES_PASSWORD}"

    psql -v ON_ERROR_STOP=1 \
      --username "${POSTGRES_USER}" \
      --dbname postgres \
      --set=app_db_name="${APP_DB_NAME}" \
      --set=app_db_user="${APP_DB_USER}" \
      --set=app_db_password="${APP_DB_PASSWORD}" <<'EOSQL'
    DO
    $do$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'app_db_user') THEN
        EXECUTE format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_db_user', :'app_db_password');
      ELSE
        EXECUTE format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'app_db_user', :'app_db_password');
      END IF;
    END
    $do$;

    SELECT format('CREATE DATABASE %I OWNER %I', :'app_db_name', :'app_db_user')
    WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'app_db_name') \gexec

    REVOKE ALL ON DATABASE :"app_db_name" FROM PUBLIC;
    GRANT ALL PRIVILEGES ON DATABASE :"app_db_name" TO :"app_db_user";
    EOSQL

    psql -v ON_ERROR_STOP=1 \
      --username "${POSTGRES_USER}" \
      --dbname "${APP_DB_NAME}" \
      --set=app_db_user="${APP_DB_USER}" <<'EOSQL'
    ALTER SCHEMA public OWNER TO :"app_db_user";
    GRANT ALL ON SCHEMA public TO :"app_db_user";
    EOSQL
```

### `4-services.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgresql-hl
  namespace: databases-prod
  labels:
    app.kubernetes.io/name: postgresql
spec:
  clusterIP: None
  selector:
    app.kubernetes.io/name: postgresql
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
---
apiVersion: v1
kind: Service
metadata:
  name: postgresql
  namespace: databases-prod
  labels:
    app.kubernetes.io/name: postgresql
spec:
  type: ClusterIP
  selector:
    app.kubernetes.io/name: postgresql
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
```

### `5-networkpolicy.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgresql-default-deny-ingress
  namespace: databases-prod
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: postgresql
  policyTypes:
    - Ingress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgresql-allow-from-selected-namespaces
  namespace: databases-prod
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: postgresql
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: databases-prod
        - namespaceSelector:
            matchLabels:
              kakde.eu/postgresql-access: "true"
      ports:
        - protocol: TCP
          port: 5432
```

### `6-statefulset.yaml`

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql
  namespace: databases-prod
  labels:
    app.kubernetes.io/name: postgresql
spec:
  serviceName: postgresql-hl
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: postgresql
  template:
    metadata:
      labels:
        app.kubernetes.io/name: postgresql
        app.kubernetes.io/component: primary
    spec:
      nodeSelector:
        kakde.eu/postgresql: "true"
      terminationGracePeriodSeconds: 120
      securityContext:
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: postgresql
          image: postgres:17.9
          imagePullPolicy: IfNotPresent
          ports:
            - name: postgres
              containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_DB
              value: postgres
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgresql-auth
                  key: postgres-superuser-password
            - name: APP_DB_NAME
              valueFrom:
                secretKeyRef:
                  name: postgresql-auth
                  key: app-db-name
            - name: APP_DB_USER
              valueFrom:
                secretKeyRef:
                  name: postgresql-auth
                  key: app-db-user
            - name: APP_DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgresql-auth
                  key: app-db-password
            - name: PGDATA
              value: /var/lib/postgresql/data/pgdata
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "2"
              memory: "4Gi"
          startupProbe:
            exec:
              command:
                - sh
                - -c
                - pg_isready -h 127.0.0.1 -p 5432 -U "$POSTGRES_USER" -d postgres
            periodSeconds: 5
            timeoutSeconds: 5
            failureThreshold: 60
          readinessProbe:
            exec:
              command:
                - sh
                - -c
                - pg_isready -h 127.0.0.1 -p 5432 -U "$POSTGRES_USER" -d postgres
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 6
          livenessProbe:
            exec:
              command:
                - sh
                - -c
                - pg_isready -h 127.0.0.1 -p 5432 -U "$POSTGRES_USER" -d postgres
            periodSeconds: 20
            timeoutSeconds: 5
            failureThreshold: 6
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
            - name: initdb
              mountPath: /docker-entrypoint-initdb.d
      volumes:
        - name: initdb
          configMap:
            name: postgresql-init
  volumeClaimTemplates:
    - metadata:
        name: data
        labels:
          app.kubernetes.io/name: postgresql
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: local-path
        resources:
          requests:
            storage: 80Gi
```

---

## Validation and testing

## Check all resources

Run on `ms-1`:

```bash
kubectl -n databases-prod get all,pvc,configmap,secret,networkpolicy
```

Good looks like:

* StatefulSet exists
* pod exists
* both services exist
* PVC exists and is `Bound`
* Secret exists
* ConfigMap exists
* NetworkPolicies exist

---

## Check rollout status

Run on `ms-1`:

```bash
kubectl -n databases-prod rollout status statefulset/postgresql --timeout=300s
kubectl -n databases-prod get pod postgresql-0 -o wide
kubectl -n databases-prod get pvc
```

Good looks like:

* rollout succeeds
* pod is `1/1 Running`
* PVC is `Bound`

---

## Check logs

Run on `ms-1`:

```bash
kubectl -n databases-prod logs postgresql-0 | tail -n 80
```

Good looks like:

* no permission errors
* normal PostgreSQL startup messages

---

## Check services and endpoints

Run on `ms-1`:

```bash
kubectl -n databases-prod get svc
kubectl -n databases-prod get endpointslice
```

Good looks like:

* `postgresql` is a `ClusterIP` service on `5432`
* the EndpointSlice points to the PostgreSQL pod IP

---

## Test the PostgreSQL superuser login

Run on `ms-1`:

```bash
kubectl -n databases-prod exec -it postgresql-0 -- sh -lc '
  export PGPASSWORD="$POSTGRES_PASSWORD"
  psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres -c "select current_user, current_database();"
'
```

What this does:

* enters the pod
* authenticates as the PostgreSQL superuser
* runs a tiny SQL query

Good looks like:

* `current_user = postgres`
* `current_database = postgres`

---

## Test the application user login

Run on `ms-1`:

```bash
kubectl -n databases-prod exec -it postgresql-0 -- sh -lc "
  export PGPASSWORD=\"\$APP_DB_PASSWORD\"
  psql -v ON_ERROR_STOP=1 -h postgresql -U \"\$APP_DB_USER\" -d \"\$APP_DB_NAME\" -c 'select current_database(), current_user;'
"
```

Good looks like:

* `current_database = appdb`
* `current_user = appuser`

---

## Test writes and reads

Run on `ms-1`:

```bash
kubectl -n databases-prod exec -it postgresql-0 -- sh -lc "
  export PGPASSWORD=\"\$APP_DB_PASSWORD\"
  psql -v ON_ERROR_STOP=1 -h postgresql -U \"\$APP_DB_USER\" -d \"\$APP_DB_NAME\" <<'SQL'
CREATE TABLE IF NOT EXISTS healthcheck (
  id serial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO healthcheck DEFAULT VALUES;
SELECT count(*) AS rows FROM healthcheck;
SQL
"
```

Good looks like:

* `CREATE TABLE`
* `INSERT 0 1`
* row count is at least `1`

---

## Troubleshooting that happened in this document

## Problem 1: Pod crashlooped immediately after startup

### Symptom

The pod moved through:

* `ContainerCreating`
* `Running`
* `Error`
* `CrashLoopBackOff`

Logs showed:

```text
chmod: changing permissions of '/var/run/postgresql': Operation not permitted
chown: changing ownership of '/var/lib/postgresql/data/pgdata': Operation not permitted
```

### Cause

The hardening settings were too strict for the PostgreSQL container’s first boot.

### Fix

Patch or update the StatefulSet so that:

* container-level `securityContext` is removed
* `fsGroup` is removed
* pod-level `seccompProfile: RuntimeDefault` is kept

### Verification

After recreating the pod:

* PostgreSQL started successfully
* logs no longer showed `Operation not permitted`

---

## Problem 2: Application user could not log in

### Symptom

This failed:

```text
FATAL:  password authentication failed for user "appuser"
```

### Cause

The live PostgreSQL role password did not match the Secret value anymore. The bootstrap script only runs on first initialization.

### Fix

Repair the role and database explicitly using `psql`.

The document settled on a safer method:

* create SQL files on `ms-1`
* pipe them into `psql` running inside the pod

### Repair SQL used in this document

Create the file on `ms-1`:

```bash
cat > /tmp/pg-repair.sql <<'SQL'
SELECT current_user, current_database();

SELECT rolname, rolsuper, rolcanlogin
FROM pg_roles
WHERE rolname IN ('postgres', :'app_db_user');

SELECT datname, pg_catalog.pg_get_userbyid(datdba) AS owner
FROM pg_database
WHERE datname IN ('postgres', :'app_db_name');

SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_db_user', :'app_db_password')
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'app_db_user'
) \gexec

SELECT format('ALTER ROLE %I LOGIN PASSWORD %L', :'app_db_user', :'app_db_password') \gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'app_db_name', :'app_db_user')
WHERE NOT EXISTS (
  SELECT 1 FROM pg_database WHERE datname = :'app_db_name'
) \gexec

SELECT format('ALTER DATABASE %I OWNER TO %I', :'app_db_name', :'app_db_user') \gexec

SELECT format('REVOKE ALL ON DATABASE %I FROM PUBLIC', :'app_db_name') \gexec
SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'app_db_name', :'app_db_user') \gexec
SQL
```

Run it:

```bash
kubectl -n databases-prod exec -i postgresql-0 -- sh -lc "export PGPASSWORD=\"\$POSTGRES_PASSWORD\"; psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres --set=app_db_name=\"\$APP_DB_NAME\" --set=app_db_user=\"\$APP_DB_USER\" --set=app_db_password=\"\$APP_DB_PASSWORD\"" < /tmp/pg-repair.sql
```

Then create the schema fix file:

```bash
cat > /tmp/pg-schema-fix.sql <<'SQL'
SELECT format('ALTER SCHEMA public OWNER TO %I', :'app_db_user') \gexec
SELECT format('GRANT ALL ON SCHEMA public TO %I', :'app_db_user') \gexec
SQL
```

Run it:

```bash
kubectl -n databases-prod exec -i postgresql-0 -- sh -lc "export PGPASSWORD=\"\$POSTGRES_PASSWORD\"; psql -v ON_ERROR_STOP=1 --username postgres --dbname \"\$APP_DB_NAME\" --set=app_db_user=\"\$APP_DB_USER\"" < /tmp/pg-schema-fix.sql
```

Good looks like:

* `CREATE ROLE`
* `ALTER ROLE`
* `CREATE DATABASE`
* `ALTER DATABASE`
* `REVOKE`
* `GRANT`
* `ALTER SCHEMA`
* `GRANT`

---

## Problem 3: wrong `kubectl port-forward` syntax

### Wrong command

```bash
kubectl -n databases-prod port-forward svc/postgresql 127.0.0.1:15432:5432
```

### Error

```text
error: Service 'postgresql' does not have a named port '127.0.0.1'
```

### Correct command

```bash
kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432
```

---

## Problem 4: SSH tunnel attempted with `-N` while also needing a remote command

### Failing idea

```bash
ssh -N -L 15432:127.0.0.1:15432 root@192.168.15.2 'kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432'
```

### Better command

```bash
ssh -L 15432:127.0.0.1:15432 root@192.168.15.2 \
  'kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432'
```

Keep that terminal open, then connect from another Mac terminal.

---

## How to connect from a Mac

There are two practical methods described in this document.

## Method 1: direct `kubectl port-forward` from the Mac

This works only if the Mac already has working `kubectl` access to the cluster.

Run on the Mac:

```bash
kubectl -n databases-prod port-forward svc/postgresql 15432:5432
```

Then from another Mac terminal:

```bash
PGPASSWORD='YOUR_APP_DB_PASSWORD' psql -h 127.0.0.1 -p 15432 -U appuser -d appdb
```

---

## Method 2: SSH + remote Kubernetes port-forward

This is useful when the Mac can SSH to `ms-1` but does not have direct `kubectl` access.

Run on the Mac:

```bash
ssh -L 15432:127.0.0.1:15432 root@192.168.15.2 \
  'kubectl -n databases-prod port-forward --address 127.0.0.1 svc/postgresql 15432:5432'
```

Leave that terminal open.

Then from another Mac terminal:

```bash
PGPASSWORD='YOUR_APP_DB_PASSWORD' psql -h 127.0.0.1 -p 15432 -U appuser -d appdb
```

Good looks like:

* `psql` connects successfully
* SQL commands can be executed locally on the Mac against the tunnel

### Important note

This access method is **temporary** and preserves the security model because the database remains internal-only.

---

## Backup and restore basics

Because the deployment uses K3s `local-path` storage, backups are especially important. `local-path` uses local storage on the node that hosts the pod. ([docs.k3s.io][3])

## Backup the application database

Run on `ms-1`:

```bash
kubectl -n databases-prod exec postgresql-0 -- sh -lc \
'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_dump -U postgres -d "$APP_DB_NAME" -Fc' \
> appdb-$(date +%F).dump
```

What this does:

* runs `pg_dump` inside the pod
* writes a custom-format backup file to the local machine where the command is executed

Good looks like:

* a file like `appdb-2026-03-15.dump` appears

---

## Full logical backup

Run on `ms-1`:

```bash
kubectl -n databases-prod exec postgresql-0 -- sh -lc \
'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_dumpall -U postgres' \
> pg-all-$(date +%F).sql
```

Good looks like:

* a file like `pg-all-2026-03-15.sql` appears

---

## Restore a custom-format backup

Run on `ms-1`:

```bash
cat appdb-YYYY-MM-DD.dump | kubectl -n databases-prod exec -i postgresql-0 -- sh -lc \
'export PGPASSWORD="$POSTGRES_PASSWORD"; pg_restore -U postgres -d "$APP_DB_NAME" --clean --if-exists'
```

---

## Restore a SQL dump

Run on `ms-1`:

```bash
cat pg-all-YYYY-MM-DD.sql | kubectl -n databases-prod exec -i postgresql-0 -- sh -lc \
'export PGPASSWORD="$POSTGRES_PASSWORD"; psql -U postgres -d postgres'
```

---

## Full cleanup and fresh redeploy

Use this only when a total reset is intended.

### Delete the PostgreSQL resources

Run on `ms-1`:

```bash
kubectl -n databases-prod delete statefulset postgresql --ignore-not-found
kubectl -n databases-prod delete service postgresql postgresql-hl --ignore-not-found
kubectl -n databases-prod delete configmap postgresql-init --ignore-not-found
kubectl -n databases-prod delete secret postgresql-auth --ignore-not-found
kubectl -n databases-prod delete networkpolicy postgresql-default-deny-ingress postgresql-allow-from-selected-namespaces --ignore-not-found
kubectl -n databases-prod delete pvc data-postgresql-0 --ignore-not-found
kubectl delete namespace databases-prod --ignore-not-found
```

### Why delete the PVC too?

If the PVC is kept, PostgreSQL may reuse the old data directory and the first-run bootstrap logic may not run the way a fresh deployment expects.

### Fresh redeploy

Run on `ms-1`:

```bash
cd ~/deployment/postgresql

kubectl label node wk-1 kakde.eu/postgresql=true --overwrite
kubectl label namespace apps-prod kakde.eu/postgresql-access=true --overwrite

kubectl apply -f 1-namespace.yaml
kubectl apply -f 2-secret.yaml
kubectl apply -f 3-init-configmap.yaml
kubectl apply -f 4-services.yaml
kubectl apply -f 5-networkpolicy.yaml
kubectl apply -f 6-statefulset.yaml
```

Then verify again:

```bash
kubectl -n databases-prod rollout status statefulset/postgresql --timeout=300s
kubectl -n databases-prod get all,pvc,configmap,secret,networkpolicy
kubectl -n databases-prod get endpointslice
kubectl -n databases-prod logs postgresql-0 | tail -n 80
```

---

## Open questions and future improvements

It is intentionally kept the setup simple. Some future improvements were mentioned or implied:

1. **Better day-to-day access from the Mac without port-forward**

    * likely through a private WireGuard-based admin path
    * not implemented in this document

2. **More resilient storage**

    * `local-path` is simple but node-local
    * a replicated storage system would improve resilience

3. **Password rotation runbook**

    * the document explains the principle
    * a dedicated operational script could make it easier

4. **Automated backups**

    * backups were described manually
    * scheduled jobs were not added in this document

---

## Glossary

### ClusterIP

A Kubernetes Service type that is reachable only from inside the cluster. It is commonly used for internal databases and internal APIs. ([Kubernetes][2])

### ConfigMap

A Kubernetes object used to store non-sensitive configuration data. In this deployment, it stores the first-run database bootstrap script.

### EndpointSlice

A Kubernetes object that tracks which pod IPs back a Service.

### Ingress

A Kubernetes API object used mainly for HTTP/HTTPS routing into services. It was intentionally **not** used for PostgreSQL.

### K3s

A lightweight Kubernetes distribution that simplifies cluster setup and includes some batteries-included defaults. ([docs.k3s.io][5])

### Local Path Provisioner

The default K3s storage provisioner that creates persistent volumes on the local disk of the node running the pod. ([docs.k3s.io][3])

### NetworkPolicy

A Kubernetes API object that restricts which network traffic is allowed to reach selected pods. ([Kubernetes][4])

### Persistent Volume Claim (PVC)

A Kubernetes request for storage. In this setup, the StatefulSet automatically creates a PVC for PostgreSQL storage.

### Pod

The basic runnable unit in Kubernetes. A pod can contain one or more containers.

### PostgreSQL superuser

The main admin account in PostgreSQL. In this setup, the username is `postgres`.

### StatefulSet

A Kubernetes workload object used for applications that need stable identity and persistent storage, such as databases. ([Kubernetes][1])

---

## Official learning links

These are good official or high-quality places to learn the concepts used in this guide:

* Kubernetes StatefulSet documentation for why stateful apps like databases use StatefulSets. ([Kubernetes][1])
* Kubernetes Service documentation for how `ClusterIP` works. ([Kubernetes][2])
* Kubernetes “Expose Your App” tutorial for the difference between `ClusterIP`, `NodePort`, and other service types. ([Kubernetes][6])
* Kubernetes NetworkPolicy documentation for how ingress restrictions work. ([Kubernetes][4])
* K3s storage documentation for how `local-path` works and why it is node-local. ([docs.k3s.io][3])
* Kubernetes general networking documentation for cluster networking basics. ([Kubernetes][7])

If you want this next as a downloadable `README.md` or a longer runbook format with a “copy/paste commands only” appendix, I can format it that way.

[1]: https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/ "StatefulSets"
[2]: https://kubernetes.io/docs/concepts/services-networking/service/ "Service"
[3]: https://docs.k3s.io/add-ons/storage "Volumes and Storage"
[4]: https://kubernetes.io/docs/concepts/services-networking/network-policies/ "Network Policies"
[5]: https://docs.k3s.io/ "K3s - Lightweight Kubernetes | K3s"
[6]: https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/ "Using a Service to Expose Your App"
[7]: https://kubernetes.io/docs/concepts/services-networking/ "Services, Load Balancing, and Networking"
