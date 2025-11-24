# Single-node PostgreSQL instance:

* A `StatefulSet` named `postgres` in namespace `postgres`
* A 25Gi PVC on `local-path` bound to `worker-01`
* A `ClusterIP` Service `postgres` (`10.43.12.136:5432`)
* Verified data path and DB responsiveness
* An SSH tunnel pattern from macOS to reach PostgreSQL from your jumpbox
* Basic patterns for databases, roles, and sample data import

Below is the full, consolidated documentation.

---

## 0. High-Level Checklist

1. **Confirm storage & node capacity** (local-path, disk space on worker-01)
2. **Create `postgres` namespace and superuser Secret**
3. **Deploy PostgreSQL `StatefulSet` + `Service` with a 25Gi PVC**
4. **Validate the pod, PVC, and basic DB health**
5. **Create SSH tunnel from macOS jumpbox to PostgreSQL Service**
6. **Create databases & roles; import sample data**
7. **Explain 25Gi sizing + observability & maintenance recommendations**

Everything below assumes you run `kubectl` and `ssh` from **macOS jumpbox**, with your K3s context already pointing to this cluster.

---

## 1. Confirm StorageClass and Node Capacity

### 1.1 Check StorageClass on the cluster

**Step 1 – List StorageClasses (confirm `local-path` default)**

```bash
kubectl get storageclass
```

* **Purpose:** Ensure `local-path` exists and is default.
* **Expected (your actual output):**

  ```text
  NAME                   PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
  local-path (default)   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  85d
  ```

**Troubleshooting:**

* If `local-path` is missing or not default, install/enable the K3s local-path provisioner or set another StorageClass as default before proceeding.

---

### 1.2 Check disk space on `worker-01`

**Step 2 – Confirm free space under `/var/lib/rancher/k3s` on worker-01**

```bash
ssh root@worker-01 'df -h /var/lib/rancher/k3s'
```

* **Purpose:** Validate that `worker-01` has enough disk for a 25Gi PVC.
* **Expected (your actual output):**

  ```text
  Filesystem      Size  Used Avail Use% Mounted on
  /dev/nvme0n1p2  906G   30G  831G   4% /
  ```

**Troubleshooting:**

* If `Avail` is low relative to 25Gi (e.g., <30Gi), consider reducing PVC size or adding storage.

---

## 2. Create Namespace and Superuser Secret

We isolate PostgreSQL in its own namespace and keep the superuser password in a Kubernetes Secret.

### 2.1 Create the `postgres` namespace

**Step 3 – Create namespace `postgres`**

```bash
kubectl create namespace postgres
```

* **Purpose:** Logical isolation and easier RBAC/NetworkPolicy later.

(If it already exists, you’ll see an “AlreadyExists” message, which is fine.)

---

### 2.2 Generate a strong superuser password on macOS

**Step 4 – Generate a strong password (local, not logged in shell history)**

```bash
openssl rand -base64 32 > ~/homelab/postgres/postgres-superuser.pw
```

* **Purpose:** Create a strong, random password outside of Kubernetes first.

**Step 5 – Inspect the password once (optional)**

```bash
cat ~/homelab/postgres/postgres-superuser.pw
```

* **Purpose:** You may need this once to test psql; avoid reprinting it regularly.

> **Security note:**
>
> * Do **not** commit `postgres-superuser.pw` to Git.
> * Consider using password managers or external secret managers in the future.

---

### 2.3 Create the superuser Secret in Kubernetes

We’ll store **username `postgres`** and the random password in a Secret.

**Step 6 – Create Secret from literals**

```bash
kubectl -n postgres create secret generic postgres-superuser \
  --from-literal=username=postgres \
  --from-file=password=~/homelab/postgres/postgres-superuser.pw
```

* **Purpose:** Create `postgres-superuser` Secret with `username` and `password` keys.

**Step 7 – Verify the Secret exists**

```bash
kubectl -n postgres get secret postgres-superuser
```

* **Purpose:** Confirm that the Secret was created successfully.

**Troubleshooting:**

* If you see “already exists”, either reuse it or `kubectl delete secret` then recreate.
* Never `kubectl describe secret` if you’re screen-sharing; it can show base64-encoded data.

---

## 3. Deploy PostgreSQL StatefulSet + Service (25Gi PVC)

We’ll write a minimal-but-secure manifest using a Debian-based image so `bash` is available (as you already used `bash` inside the pod).

### 3.1 Create the manifest file

**Step 8 – Create manifest file on macOS (Git repo path)**

```bash
mkdir -p ~/homelab/postgres
cd ~/homelab/postgres
cat > postgres-statefulset.yaml <<'EOF'
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: postgres
  labels:
    app: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 999
        runAsGroup: 999
        fsGroup: 999
      containers:
        - name: postgres
          image: postgres:16
          imagePullPolicy: IfNotPresent
          env:
            - name: POSTGRES_DB
              value: postgres
            - name: POSTGRES_USER
              valueFrom:
                secretKeyRef:
                  name: postgres-superuser
                  key: username
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-superuser
                  key: password
          ports:
            - name: postgres
              containerPort: 5432
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
          readinessProbe:
            exec:
              command: ["bash", "-lc", "pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\""]
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            exec:
              command: ["bash", "-lc", "pg_isready -U \"$POSTGRES_USER\" -d \"$POSTGRES_DB\""]
            initialDelaySeconds: 30
            periodSeconds: 10
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
  volumeClaimTemplates:
    - metadata:
        name: data
        labels:
          app: postgres
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: local-path
        resources:
          requests:
            storage: 25Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: postgres
  labels:
    app: postgres
spec:
  type: ClusterIP
  selector:
    app: postgres
  ports:
    - name: postgres
      port: 5432
      targetPort: 5432
EOF
```

* **Purpose:** Declaratively define the PostgreSQL `StatefulSet` + `Service` with a 25Gi PVC.

> If you prefer a different version, you can change `image: postgres:16` to `postgres:15.15` or `postgres:15.15-trixie`.
> We used a full Debian-based image so `bash` and `pg_isready` work as seen in your tests.

---

### 3.2 Apply the manifest

**Step 9 – Deploy PostgreSQL**

```bash
kubectl apply -f postgres-statefulset.yaml
```

* **Purpose:** Create/upgrade the StatefulSet and Service.

---

### 3.3 Verify StatefulSet, Pod, and PVC

**Step 10 – Check StatefulSet, Pods, and PVC**

```bash
kubectl -n postgres get statefulset,pods,pvc
```

* **Purpose:** Ensure the pod is running and PVC is bound.
* **Your actual output:**

  ```text
  NAME                        READY   AGE
  statefulset.apps/postgres   1/1     43s

  NAME             READY   STATUS    RESTARTS   AGE
  pod/postgres-0   1/1     Running   0          43s

  NAME                                    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   VOLUMEATTRIBUTESCLASS   AGE
  persistentvolumeclaim/data-postgres-0   Bound    pvc-7a7584d2-4333-40a0-8601-5c0818e108d6   25Gi       RWO            local-path     <unset>                 43s
  ```

**Step 11 – Describe the PVC for traceability**

```bash
kubectl -n postgres describe pvc data-postgres-0
```

* **Purpose:** Confirm binding events, selected node, and capacity.
* **Relevant parts of your output:**

  ```text
  StorageClass:  local-path
  VolumeMode:    Filesystem
  Capacity:      25Gi
  Access Modes:  RWO
  ...
  Annotations:
    volume.kubernetes.io/selected-node: worker-01
  Events:
    Normal  ProvisioningSucceeded  ...  Successfully provisioned volume pvc-7a7584d2-4333-40a0-8601-5c0818e108d6
  ```

**Troubleshooting:**

* If PVC stuck in `Pending`, confirm `local-path-provisioner` pod is running in `kube-system` and that the target node has sufficient disk.

---

## 4. Validate PostgreSQL Data Path and DB Health

### 4.1 Exec into the pod and verify disk & basic query

**Step 12 – Check disk usage and DB time from inside the pod**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc '
  echo "== Disk usage ==" &&
  df -h /var/lib/postgresql/data &&
  echo "== DB time test ==" &&
  psql -U "$POSTGRES_USER" -d postgres -c "SELECT now() AS db_time;"
'
```

* **Purpose:**

    * Verify the mounted filesystem (should reflect host disk capacity).
    * Confirm you can connect to PostgreSQL with the configured user.
* **Your actual output:**

  ```text
  == Disk usage ==
  Filesystem      Size  Used Avail Use% Mounted on
  /dev/nvme0n1p2  906G   31G  830G   4% /var/lib/postgresql/data
  == DB time test ==
              db_time
  -------------------------------
  2025-11-16 22:16:52.017652+00
  (1 row)
  ```

**Troubleshooting:**

* If `psql` fails with authentication errors, verify the password in the Secret matches the one you generated.
* If readiness/liveness probes fail, check logs:

  ```bash
  kubectl -n postgres logs postgres-0
  ```

---

## 5. SSH Tunnel from macOS Jumpbox to PostgreSQL

We mirror your MSSQL tunnel pattern, using the **ClusterIP** of the `postgres` Service from a node (`master-01`) that can see the cluster network.

### 5.1 Confirm the Service IP

**Step 13 – Get the Service details**

```bash
kubectl -n postgres get svc postgres
```

* **Purpose:** Confirm the Service IP/port for tunneling.
* **Your actual output:**

  ```text
  NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
  postgres   ClusterIP   10.43.12.136   <none>        5432/TCP   26m
  ```

---

### 5.2 Ensure SSH config for `master-01` on macOS

(You already have this from MSSQL docs, included here for completeness.)

**Step 14 – Edit `~/.ssh/config` on macOS**

```bash
cat >> ~/.ssh/config <<'EOF'
Host master-01
  HostName 192.168.15.2
  User root
  Port 22
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 10
  ServerAliveCountMax 3
EOF
```

* **Purpose:** Define a reusable SSH host entry for `master-01`.

> Adjust `HostName` if your actual IP differs; this matches your MSSQL tunnel config.

---

### 5.3 Create a local PostgreSQL tunnel (macOS → master-01 → Service)

**Step 15 – Start the SSH tunnel (from macOS)**

```bash
ssh -o ExitOnForwardFailure=yes \
    -o ServerAliveInterval=10 \
    -o ServerAliveCountMax=3 \
    -N -L 127.0.0.1:15432:10.43.12.136:5432 master-01
```

* **Purpose:**

    * Forward `localhost:15432` on macOS to `10.43.12.136:5432` (PostgreSQL Service) via `master-01`.
    * The tunnel process runs in the foreground; keep it open while using the DB.

**Troubleshooting:**

* If you get `channel 3: open failed: connect failed: Connection refused`, ensure:

    * The `postgres` pod is Running and Ready.
    * The Service IP is reachable from `master-01`:

      ```bash
      ssh root@master-01 'nc -vz 10.43.12.136 5432'
      ```

---

### 5.4 Test remote connection from macOS

**Step 16 – Test connection with `psql` from macOS**

```bash
PGUSER=$(kubectl -n postgres get secret postgres-superuser -o jsonpath='{.data.username}' | base64 -d)
PGPASS=$(kubectl -n postgres get secret postgres-superuser -o jsonpath='{.data.password}' | base64 -d)

PGPASSWORD="$PGPASS" psql "postgresql://$PGUSER@127.0.0.1:15432/postgres?sslmode=prefer" -c "SELECT current_database(), current_user;"
```

* **Purpose:** Validate end-to-end connectivity via SSH tunnel.

> For long-term usage, put credentials into `~/.pgpass` instead of exporting passwords in shell.

---

## 6. Create Databases, Roles, and Import Sample Data

You asked to “create a database in PostgreSQL and import some sample data from web”. Below is a pattern you can and likely did follow (and can repeat).

### 6.1 Create per-application databases and roles

We’ll create minimal examples for **Keycloak** and a **sample microservice**.

> Run these either **inside the pod** (as you did before) or via **psql over the tunnel**. Below uses `kubectl exec`.

**Step 17 – Open a `psql` session inside the pod**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc 'psql -U "$POSTGRES_USER" postgres'
```

* **Purpose:** Use `psql` interactively as superuser.

Inside `psql`, run (type or paste):

```sql
-- Keycloak DB and user
CREATE DATABASE keycloak;
CREATE USER keycloak WITH PASSWORD 'CHANGE_ME_STRONG';
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

-- Sample microservice DB and user
CREATE DATABASE appdb;
CREATE USER appuser WITH PASSWORD 'CHANGE_ME_STRONG';
GRANT CONNECT ON DATABASE appdb TO appuser;

\q
```

> **Security:**
>
> * Replace `CHANGE_ME_STRONG` with real strong passwords and store them in **Kubernetes Secrets** per app (not in manifests).
> * For production-like setup, restrict privileges further (e.g., `GRANT` only on required schemas/tables).

---

### 6.2 Import sample data (example pattern)

As an example, you can use a small sample schema like **Pagila** or any other demo dataset.

**Step 18 – Download sample SQL on macOS**

```bash
cd ~/homelab/postgres
curl -L -o sample-schema.sql 'https://example.com/path/to/sample-schema.sql'
curl -L -o sample-data.sql   'https://example.com/path/to/sample-data.sql'
```

* **Purpose:** Fetch sample SQL files (schema + data).
* **Note:** Replace URLs with the actual sample you choose.

**Step 19 – Copy SQL files into the pod**

```bash
kubectl -n postgres cp sample-schema.sql postgres/postgres-0:/tmp/sample-schema.sql
kubectl -n postgres cp sample-data.sql   postgres/postgres-0:/tmp/sample-data.sql
```

* **Purpose:** Make the SQL files available inside the container.

**Step 20 – Create a dedicated sample database and import**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc '
  createdb -U "$POSTGRES_USER" sampledb &&
  psql -U "$POSTGRES_USER" -d sampledb -f /tmp/sample-schema.sql &&
  psql -U "$POSTGRES_USER" -d sampledb -f /tmp/sample-data.sql
'
```

* **Purpose:**

    * Create `sampledb`.
    * Apply schema and data.

**Step 21 – Verify data import**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc '
  psql -U "$POSTGRES_USER" -d sampledb -c "SELECT COUNT(*) FROM information_schema.tables;"
'
```

* **Purpose:** Sanity check that tables exist.

**Troubleshooting:**

* If you get `relation does not exist`, confirm the SQL files actually create tables or adjust verification query.
* If `createdb` fails with “database already exists”, drop it first if you’re okay losing data:

  ```bash
  kubectl -n postgres exec -it postgres-0 -- bash -lc 'dropdb -U "$POSTGRES_USER" sampledb'
  ```

---

## 7. 25Gi Capacity Rationale

You originally considered 75Gi but reduced to **25Gi**. Given your usage:

* **Keycloak:** primarily identity/auth tables; moderate row counts, small payloads.
* **Excalidraw-like app:** uses PostgreSQL mostly for metadata; large diagrams should be in **object storage (S3/MinIO)** or separate file store.
* **Custom microservices:** mostly relational data, not binary blobs.

With these constraints:

* Typical homelab usage for these services often stays under **a few GiB** of total DB size.
* 25Gi allows:

    * Several GiB for **data**.
    * Several GiB for **indexes**.
    * Adequate room for **WAL growth**, **autovacuum**, **maintenance operations**, and **testing / temporary spikes**.
* As a rule of thumb, try to keep **< 70–80%** of volume used; beyond that, monitor carefully.

For growth:

* If you later see `df -h /var/lib/postgresql/data` > 70–80% usage or `pg_database_size` approaching ~20Gi, plan either:

    * Offloading logs / aggressive cleanup.
    * Migrating to a bigger volume (new PVC + data migration).

---

## 8. Connecting Applications Inside the Cluster (Pattern)

Example connection strings for apps running in the `postgres` namespace or others:

* **Service DNS:** `postgres.postgres.svc.cluster.local`
* **Port:** `5432`

Examples:

**Keycloak (env var style):**

```bash
POSTGRES_URL="jdbc:postgresql://postgres.postgres.svc.cluster.local:5432/keycloak"
POSTGRES_USERNAME="keycloak"
POSTGRES_PASSWORD="(from Kubernetes Secret)"
```

**Microservice (simple DSN):**

```bash
DATABASE_URL="postgresql://appuser:APP_PASSWORD@postgres.postgres.svc.cluster.local:5432/appdb?sslmode=prefer"
```

> Store `POSTGRES_USERNAME` and `POSTGRES_PASSWORD` in **Kubernetes Secrets** per application, not in plain Deployment YAML.

---

## 9. Observability, Maintenance, and Next Steps

### 9.1 Basic monitoring queries from inside the pod

**Step 22 – Check database sizes**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc '
  psql -U "$POSTGRES_USER" -d postgres -c "
    SELECT datname, pg_size_pretty(pg_database_size(datname))
    FROM pg_database
    ORDER BY pg_database_size(datname) DESC;
  "
'
```

* **Purpose:** Track per-database size against your 25Gi limit.

**Step 23 – Check connection counts**

```bash
kubectl -n postgres exec -it postgres-0 -- bash -lc '
  psql -U "$POSTGRES_USER" -d postgres -c "
    SELECT datname, count(*) 
    FROM pg_stat_activity 
    GROUP BY datname;
  "
'
```

* **Purpose:** Monitor active connections, useful when tuning `max_connections`.

**Step 24 – Look for slow queries (if `log_min_duration_statement` enabled)**

```bash
kubectl -n postgres logs postgres-0 | grep -i duration || true
```

* **Purpose:** Inspect logs for long-running queries.

---

### 9.2 Backups (logical dump from macOS via tunnel)

**Step 25 – Dump a single database via SSH tunnel**

```bash
PGUSER=$(kubectl -n postgres get secret postgres-superuser -o jsonpath='{.data.username}' | base64 -d)
PGPASS=$(kubectl -n postgres get secret postgres-superuser -o jsonpath='{.data.password}' | base64 -d)

PGPASSWORD="$PGPASS" pg_dump \
  -h 127.0.0.1 -p 15432 -U "$PGUSER" -d keycloak \
  > ~/backups/postgres/keycloak-$(date +%F).sql
```

* **Purpose:** Create a logical backup of `keycloak` from macOS.
* **Note:** Automate this via cron or launchd with rotation (e.g., keep last 7–14 files).

**Step 26 – Restore into a new database (example)**

```bash
PGPASSWORD="$PGPASS" createdb -h 127.0.0.1 -p 15432 -U "$PGUSER" keycloak_restore
PGPASSWORD="$PGPASS" psql -h 127.0.0.1 -p 15432 -U "$PGUSER" -d keycloak_restore < ~/backups/postgres/keycloak-YYYY-MM-DD.sql
```

* **Purpose:** Validate restore procedure and be ready for recovery.

---

### 9.3 Simple retention/cleanup policies

* Periodically:

    * Run `VACUUM (VERBOSE, ANALYZE);` on larger DBs during low traffic windows.
    * Review large tables with:

      ```sql
      SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
      FROM pg_catalog.pg_statio_user_tables
      ORDER BY pg_total_relation_size(relid) DESC;
      ```
    * Rotate application logs and avoid storing binary blobs in PostgreSQL.

---

### 9.4 Future Hardening (planned, not yet applied)

You explicitly chose to **skip NetworkPolicy for now**. Recommended next steps:

* **Add NetworkPolicies**:

    * Only allow traffic to `postgres` from namespaces/pods for Keycloak, Excalidraw, your microservices, and your admin jumpbox (if you expose via NodePort/Ingress in future).
* **TLS in transit**:

    * Configure PostgreSQL with server certificates and require TLS from application clients.
* **Role hardening**:

    * Each application user should have the minimal role: `CONNECT` + `SELECT/INSERT/UPDATE/DELETE` only on relevant schemas/tables.
    * Avoid using the superuser in application connection strings.
