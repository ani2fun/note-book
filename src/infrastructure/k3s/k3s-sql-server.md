1. **Scope & prerequisites (K3S master node)**

   ```bash
   # Use master node with kubectl context that manages your K3S cluster
   kubectl version --short
   ```

    * **Purpose**: Confirm `kubectl` works on the master node.
    * **Security Note**: Use an admin context only for infra steps; switch back to least privilege for day-to-day.
    * **Test & Feedback**: Share the client/server versions if you see errors.
    * **Troubleshooting**: If `kubectl` fails, ensure the K3S service is running: `sudo systemctl status k3s`.

2. **Create isolated namespace + secure SA password secret**

   ```bash
   kubectl create namespace mssql
   # 24-ish chars from URL-safe base64 (no '+' or '/')
   export SA_PWD="$(openssl rand -base64 32 | tr -d '=\n' | head -c 24)"
   printf "%s\n" "$SA_PWD" | tee ~/mssql_k3s_SA_PASSWORD.audit.txt
   kubectl -n mssql create secret generic mssql-sa-secret --from-literal=SA_PASSWORD="$SA_PWD"
   kubectl -n mssql get secret mssql-sa-secret
   ```

    * **Purpose**: Isolate SQL Server in `mssql` namespace and store SA password in a Secret.
    * **Security Note**: `~/mssql_k3s_SA_PASSWORD.audit.txt` is for ops traceability—`chmod 600` it.
    * **Test & Feedback**: `kubectl -n mssql get secret mssql-sa-secret` should show `Opaque` with `DATA: 1`.
    * **Troubleshooting**: If secret exists, rotate: `kubectl -n mssql delete secret mssql-sa-secret` then recreate.

3. **Confirm StorageClass (we used `local-path` default)**

   ```bash
   kubectl get storageclass
   kubectl get sc -o jsonpath='{range .items[?(@.metadata.annotations.storageclass\.kubernetes\.io/is-default-class=="true")]}{.metadata.name}{"\n"}{end}'
   ```

    * **Purpose**: Ensure provisioning via `rancher.io/local-path` with `WaitForFirstConsumer`.
    * **Security Note**: `local-path` writes to the node’s filesystem; limit node access.
    * **Test & Feedback**: You should see `local-path (default)`.
    * **Troubleshooting**: If no default, set one or specify `storageClassName` in the PVC (we do).

4. **Deploy SQL Server with persistent storage (file-based manifest)**

   ```bash
   # Save as: mssql.yaml
   cat > mssql.yaml <<'YAML'
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: mssql-data
   spec:
     accessModes: ["ReadWriteOnce"]
     resources:
       requests:
         storage: 20Gi
     storageClassName: local-path
   ---
   apiVersion: apps/v1
   kind: StatefulSet
   metadata:
     name: mssql
     labels:
       app: mssql
   spec:
     serviceName: mssql
     replicas: 1
     selector:
       matchLabels:
         app: mssql
     template:
       metadata:
         labels:
           app: mssql
       spec:
         automountServiceAccountToken: false
         securityContext:
           runAsUser: 10001
           runAsGroup: 10001
           fsGroup: 10001
         volumes:
           - name: data
             persistentVolumeClaim:
               claimName: mssql-data
         containers:
           - name: mssql
             image: mcr.microsoft.com/mssql/server:2022-latest
             imagePullPolicy: IfNotPresent
             ports:
               - name: tds
                 containerPort: 1433
             env:
               - name: ACCEPT_EULA
                 value: "Y"
               - name: MSSQL_PID
                 value: "Developer"
               - name: SA_PASSWORD
                 valueFrom:
                   secretKeyRef:
                     name: mssql-sa-secret
                     key: SA_PASSWORD
             resources:
               requests:
                 cpu: "250m"
                 memory: "2Gi"
               limits:
                 cpu: "1"
                 memory: "4Gi"
             volumeMounts:
               - name: data
                 mountPath: /var/opt/mssql
             readinessProbe:
               tcpSocket:
                 port: 1433
               initialDelaySeconds: 20
               periodSeconds: 10
             startupProbe:
               tcpSocket:
                 port: 1433
               initialDelaySeconds: 10
               periodSeconds: 10
               failureThreshold: 30
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: mssql
     labels:
       app: mssql
   spec:
     type: ClusterIP
     selector:
       app: mssql
     ports:
       - name: tds
         port: 1433
         targetPort: 1433
   YAML

   kubectl -n mssql apply -f mssql.yaml
   kubectl -n mssql get all,pvc
   ```

    * **Purpose**: Creates a `20Gi` PVC, a least-privilege SQL Server 2022 `StatefulSet`, and an internal `ClusterIP` Service.
    * **Security Note**: Runs as non-root UID/GID 10001; SA password comes only from Secret; no external exposure.
    * **Test & Feedback**: `mssql-0` should appear and `mssql-data` should bind once scheduling starts.
    * **Troubleshooting**:

        * **Pod not created / PVC Pending**: Ensure `volumes` references `claimName: mssql-data`.
        * **Image pull**: Verify node egress.
        * **Probe failures**: Check logs `kubectl -n mssql logs statefulset/mssql`.

5. **Verify pod readiness + PVC binding**

   ```bash
   kubectl -n mssql get pods -w
   kubectl -n mssql get svc mssql
   kubectl -n mssql get pvc mssql-data
   ```

    * **Purpose**: Confirm `mssql-0` is `READY 1/1`, Service has `CLUSTER-IP`, PVC is `Bound`.
    * **Security Note**: Keep Service internal; we’ll use ephemeral client pods for tests.
    * **Test & Feedback**: Share if status isn’t `Running`.
    * **Troubleshooting**: If PVC remains `Pending`, wait until pod starts (SC is `WaitForFirstConsumer`).

6. **Server version check from an ephemeral client pod**

   ```bash
   kubectl -n mssql run mssql-client --rm -i --tty --restart=Never \
     --image=mcr.microsoft.com/mssql-tools:latest \
     --env MSSQL_SA_PASSWORD="$(kubectl -n mssql get secret mssql-sa-secret -o jsonpath='{.data.SA_PASSWORD}' | base64 -d)" \
     -- bash -lc '/opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT @@VERSION AS Version;"'
   ```

    * **Purpose**: Validate in-cluster connectivity via `mssql:1433` and print version (worked: SQL Server 2022 RTM-CU21).
    * **Security Note**: Password only in env var of ephemeral pod; not logged to disk.
    * **Test & Feedback**: You should see the `@@VERSION` line similar to what we saw earlier.
    * **Troubleshooting**: If `sqlcmd` not found, ensure `/opt/mssql-tools/bin/sqlcmd` path used (as above).

7. **Functional test: create DB/table → insert/select**

   ```bash
   kubectl -n mssql run mssql-client --rm -i --tty --restart=Never \
     --image=mcr.microsoft.com/mssql-tools:latest \
     --env MSSQL_SA_PASSWORD="$(kubectl -n mssql get secret mssql-sa-secret -o jsonpath='{.data.SA_PASSWORD}' | base64 -d)" \
     -- bash -lc '
       /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "CREATE DATABASE demo;"
       /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -d demo -Q "
         IF OBJECT_ID('"'"'dbo.t'"'"','"'"'U'"'"') IS NULL CREATE TABLE dbo.t(id INT PRIMARY KEY, name NVARCHAR(50));
         INSERT INTO dbo.t VALUES (1, N'"'"'hello'"'"');
         SELECT COUNT(*) AS rows, MIN(name) AS sample FROM dbo.t;"
     '
   ```

    * **Purpose**: Confirms CRUD works; output we observed: `rows=1, sample=hello`.
    * **Security Note**: All operations happen inside cluster; no external exposure.
    * **Test & Feedback**: Ensure you see `(1 rows affected)` and the expected row/sample.
    * **Troubleshooting**: If “login failed”, recheck Secret value and restart pod: `kubectl -n mssql delete pod mssql-0`.

8. **Persistence test: restart the SQL pod and re-query**

   ```bash
   kubectl -n mssql delete pod mssql-0
   kubectl -n mssql get pods -w
   ```

    * **Purpose**: Force a pod recreation; data should persist on the PVC.
    * **Security Note**: StatefulSet reattaches the same PVC.
    * **Test & Feedback**: When `mssql-0` is `READY 1/1`, re-query:

      ```bash
      kubectl -n mssql run mssql-client --rm -i --tty --restart=Never \
        --image=mcr.microsoft.com/mssql-tools:latest \
        --env MSSQL_SA_PASSWORD="$(kubectl -n mssql get secret mssql-sa-secret -o jsonpath='{.data.SA_PASSWORD}' | base64 -d)" \
        -- bash -lc '/opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -d demo -Q "SELECT COUNT(*) AS rows, MIN(name) AS sample FROM dbo.t;"'
      ```

      Expect the same: `rows=1, sample=hello`.
    * **Troubleshooting**: If missing data, confirm the container is mounting `/var/opt/mssql` from `mssql-data`: `kubectl -n mssql describe pod mssql-0 | grep -A2 Mounts`.

9. **(Optional but recommended) Lock down ingress to SQL Server (namespace-local)**

   ```bash
   # Save as: networkpolicy-mssql.yaml
   cat > networkpolicy-mssql.yaml <<'YAML'
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: default-deny-ingress
     namespace: mssql
   spec:
     podSelector: {}
     policyTypes: ["Ingress"]
   ---
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: allow-mssql-from-namespace
     namespace: mssql
   spec:
     podSelector:
       matchLabels:
         app: mssql
     policyTypes: ["Ingress"]
     ingress:
       - from:
           - podSelector: {}
         ports:
           - port: 1433
             protocol: TCP
   YAML

   kubectl apply -f networkpolicy-mssql.yaml
   kubectl -n mssql get networkpolicy
   ```

    * **Purpose**: Default-deny all ingress in `mssql`; allow TCP/1433 only from pods in the same namespace (keeps blast radius small).
    * **Security Note**: Service remains internal; `kubectl port-forward` can be used when you need local access.
    * **Test & Feedback**: Client pod in `mssql` still connects; a pod in another namespace should be blocked.
    * **Troubleshooting**: If cross-ns access still works, verify your CNI enforces NetworkPolicy.

10. **Prepare for backups (directory on PVC)**

    ```bash
    kubectl -n mssql exec mssql-0 -- bash -lc 'mkdir -p /var/opt/mssql/backup && ls -ld /var/opt/mssql/backup'
    ```

    * **Purpose**: Ensures a persistent path for `.bak` files inside the SQL Server PVC.
    * **Security Note**: Backups stay in-cluster until you export them off-cluster.
    * **Test & Feedback**: You should see the directory listing with proper ownership (`fsGroup:10001`).

11. **Automated backup (CronJob) — ready to apply when you’re set**

    ```bash
    # Save as: mssql-backup.yaml
    cat > mssql-backup.yaml <<'YAML'
    apiVersion: batch/v1
    kind: CronJob
    metadata:
      name: mssql-backup
      namespace: mssql
      labels:
        app: mssql-backup
    spec:
      schedule: "0 2 * * *"
      concurrencyPolicy: Forbid
      successfulJobsHistoryLimit: 2
      failedJobsHistoryLimit: 2
      jobTemplate:
        spec:
          template:
            spec:
              automountServiceAccountToken: false
              restartPolicy: Never
              securityContext:
                runAsUser: 10001
                runAsGroup: 10001
              containers:
                - name: backup
                  image: mcr.microsoft.com/mssql-tools:latest
                  imagePullPolicy: IfNotPresent
                  env:
                    - name: MSSQL_SA_PASSWORD
                      valueFrom:
                        secretKeyRef:
                          name: mssql-sa-secret
                          key: SA_PASSWORD
                  command: ["/bin/bash","-lc"]
                  args:
                    - >
                      NOW=$(date +%F_%H-%M-%S);
                      /opt/mssql-tools/bin/sqlcmd -S mssql -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "
                      BACKUP DATABASE [demo]
                      TO DISK = '/var/opt/mssql/backup/demo_${NOW}.bak'
                      WITH INIT, COMPRESSION, CHECKSUM;";
    YAML

    # When ready to enable backups:
    # kubectl apply -f mssql-backup.yaml
    ```

    * **Purpose**: Nightly backup at 02:00 to `/var/opt/mssql/backup/…`.
    * **Security Note**: Uses Secret-sourced password; `COMPRESSION` + `CHECKSUM` for integrity.
    * **Test & Feedback (when you enable later)**:

      ```bash
      kubectl -n mssql create job --from=cronjob/mssql-backup mssql-backup-manual
      kubectl -n mssql logs job/mssql-backup-manual
      kubectl -n mssql exec mssql-0 -- ls -lh /var/opt/mssql/backup
      ```
    * **Troubleshooting**: If no file appears, check job logs and directory permissions.

12. **Auditing & traceability (recommendation)**

    ```bash
    kubectl -n mssql get all,pvc,networkpolicy -o wide | tee -a ~/mssql_k3s_deploy_snapshot.audit.txt
    kubectl -n mssql exec mssql-0 -- /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P \
      "$(kubectl -n mssql get secret mssql-sa-secret -o jsonpath='{.data.SA_PASSWORD}' | base64 -d)" -C \
      -Q "SELECT @@VERSION;" | tee -a ~/mssql_k3s_deploy_snapshot.audit.txt
    ```

    * **Purpose**: Keep a dated snapshot for compliance and rollback notes.
    * **Security Note**: Do **not** log secrets; only metadata and version strings.

---

### What we verified (working)

* Namespace/Secret creation with strong SA password.
* Storage via `local-path` PVC (`WaitForFirstConsumer`) bound correctly.
* SQL Server 2022 (Developer) running as non-root with probes and limits.
* In-cluster connectivity using an ephemeral `mssql-tools` pod.
* Functional CRUD and **persistence across pod restart** on PVC.
* NetworkPolicies template ready (optional).
* Backup CronJob manifest prepared (to enable when you’re ready).

If you want, next we can: enable the CronJob and validate a `.bak`, export it off-cluster, and add a **read-only SQL login** for apps (least privilege).
