# Secure Access to MSSQL on K3S via macOS Jumpbox (SSH Tunnel) — End-to-End Guide

> Scope: Debian/K3S homelab; macOS jumpbox; MSSQL in `mssql` namespace. We keep the Service as **ClusterIP** (in-cluster only), reach it from macOS via **SSH local port-forward**, manage with **sqlcmd** and **VS Code (mssql)**, and restore **AdventureWorksDW2022**. Least-privilege user (`ro_app`) included.

---

## 1) Prerequisites on macOS (one-time)

1. **Install CLI tools (`kubectl`, `ssh`, `brew`, `sqlcmd`, `jq`)**

   ```bash
   brew update
   brew install sqlcmd jq
   sqlcmd -? >/dev/null
   ```

    * **Purpose**: Ensures SQL client and JSON tool are available.
    * **Security Note**: No secrets stored.
2. **Test & Feedback**: `sqlcmd -?` prints usage; `jq --version` prints a version.
3. **Troubleshooting**: If `brew: command not found`, install Homebrew first (standard script from brew.sh).

---

## 2) Verify Kubernetes objects (Service & Endpoints)

1. **Confirm Service and Endpoints**

   ```bash
   kubectl -n mssql get svc mssql -o wide | tee mssql_svc.$(date +"%Y%m%d-%H%M%S").log
   kubectl -n mssql get endpoints mssql -o wide | tee -a mssql_svc.$(date +"%Y%m%d-%H%M%S").log
   ```

    * **Purpose**: Confirms ClusterIP and live Endpoints (e.g., `10.244.x.y:1433`).
    * **Security Note**: Service remains internal (ClusterIP).
    * **Audit**: Saved to `mssql_svc.<ts>.log`.
2. **Test & Feedback**: Ensure `ENDPOINTS` shows the pod IP with `:1433`.
3. **Troubleshooting**:

    * `<none>` → selector mismatch; check:

      ```bash
      kubectl -n mssql get svc mssql -o jsonpath='{.spec.selector}{"\n"}'
      kubectl -n mssql get pods -l 'app=mssql' -o wide --show-labels
      ```

---

## 3) Open a secure SSH tunnel (localhost → ClusterIP:1433)

1. **Start Tunnel from macOS**

   ```bash
   ssh -o ExitOnForwardFailure=yes -o ServerAliveInterval=10 -o ServerAliveCountMax=3 \
     -N -L 127.0.0.1:11433:10.43.112.170:1433 master-01
   ```

    * **Purpose**: Binds `127.0.0.1:11433` → `mssql` Service IP `10.43.112.170:1433` via `master-01`.
    * **Security Note**: Loopback binding (not exposed on LAN); keepalives enabled.
    * **Audit**: In another terminal: `ps aux | grep 11433` to record the PID if needed.
2. **Test & Feedback**

   ```bash
   nc -vz 127.0.0.1 11433
   ```

    * Expect “succeeded”.
3. **Troubleshooting**:

    * Add jump host: `ssh -J cloud-vm -N -L 127.0.0.1:11433:10.43.112.170:1433 master-01`

---

## 4) Test DB connectivity with `sqlcmd`

1. **Fetch SA password from K8S & test query**

   ```bash
   export MSSQL_SA_PASSWORD="$(kubectl -n mssql get secret mssql-sa-secret -o jsonpath='{.data.SA_PASSWORD}' | base64 -d)"
   sqlcmd -S 127.0.0.1,11433 -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT @@VERSION AS v;"
   ```

    * **Purpose**: Validates the tunnel and credentials.
    * **Security Note**: Password only in env var for this shell.
    * **Audit**:

      ```bash
      echo "$(date '+%F %T') OK: tunnel 127.0.0.1:11433" >> ~/mssql_tunnel_audit.log
      ```
2. **Test & Feedback**: Expect one row with SQL Server version.
3. **Troubleshooting**:

    * Timeouts → check Step 3.
    * Login failures → re-pull secret / ensure SA enabled.

---

## 5) Configure VS Code **mssql** extension (UI method)

1. **Create New Connection (UI)**

   ```bash
   # (No command — VS Code UI)
   ```

    * **In VS Code**: `⌘⇧P` → **MS SQL: New Connection** → fill:

        * Server: `127.0.0.1,11433`
        * Auth: `SQL Login` | User: `sa` | Password: (save in Keychain)
        * Database: `demo` (or leave; can change per tab)
        * Encrypt: `Yes` | Trust server certificate: `Yes`
    * **Security Note**: Password stored in **macOS Keychain** (not in files).
2. **Save Profile (UI)**

   ```bash
   # (No command — VS Code UI)
   ```

    * **Connections** view → right-click the active connection → **Add to Connections** → name it **k3s-mssql-ssh**.
3. **Test & Feedback**

   ```bash
   # Create a test SQL and open
   mkdir -p "$HOME/Projects/k3s-mssql-ssh"
   printf '%s\n' "SELECT DB_NAME() AS db; GO" > "$HOME/Projects/k3s-mssql-ssh/test.sql"
   code "$HOME/Projects/k3s-mssql-ssh/test.sql"
   ```

    * **In VS Code**: with `test.sql` focused, click **Run Query** → expect `db` returned.

**Troubleshooting**

* “A SQL editor must have focus…” → ensure `.sql` tab is active (Language: SQL).
* Profile not listed → ensure you saved it in **Connections** and extension is enabled.

---

## 6) Restore **AdventureWorksDW2022.bak** (FILELISTONLY → RESTORE WITH MOVE)

1. **Place `.bak` in pod backup dir**

   ```bash
   kubectl -n mssql exec mssql-0 -- mkdir -p /var/opt/mssql/backup
   kubectl -n mssql cp /path/to/AdventureWorksDW2022.bak mssql/mssql-0:/var/opt/mssql/backup/AdventureWorksDW2022.bak
   kubectl -n mssql exec mssql-0 -- ls -lh /var/opt/mssql/backup/AdventureWorksDW2022.bak
   ```

    * **Purpose**: Ensures SQL Server can read the backup.
    * **Security Note**: No public exposure; stay within cluster.
2. **Discover logical file names**

   ```bash
   sqlcmd -S 127.0.0.1,11433 -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "RESTORE FILELISTONLY FROM DISK = N'/var/opt/mssql/backup/AdventureWorksDW2022.bak';"
   ```

    * **Purpose**: Get `LogicalName` for data & log (you saw `AdventureWorksDW2022` and `AdventureWorksDW2022_log`).
3. **Restore with Linux paths**

   ```bash
   sqlcmd -S 127.0.0.1,11433 -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "
     RESTORE DATABASE [AdventureWorksDW2022]
     FROM DISK = N'/var/opt/mssql/backup/AdventureWorksDW2022.bak'
     WITH MOVE N'AdventureWorksDW2022'     TO N'/var/opt/mssql/data/AdventureWorksDW2022.mdf',
          MOVE N'AdventureWorksDW2022_log' TO N'/var/opt/mssql/data/AdventureWorksDW2022_log.ldf',
          REPLACE, STATS = 5;
   "
   ```

    * **Purpose**: Maps Windows paths from the backup to valid Linux paths in the container.
    * **Security Note**: Uses encrypted tunnel; no external exposure.
4. **Verify state**

   ```bash
   sqlcmd -S 127.0.0.1,11433 -U sa -P "$MSSQL_SA_PASSWORD" -C -Q "SELECT name,state_desc FROM sys.databases WHERE name='AdventureWorksDW2022';"
   ```

    * **Expect**: `ONLINE`.
5. **VS Code refresh & query (UI)**

   ```bash
   # (No command — VS Code UI)
   ```

    * **Connections** view → Refresh → expand **Databases** → **AdventureWorksDW2022**.
    * Open a new SQL tab:

      ```sql
      USE [AdventureWorksDW2022];
      GO
      SELECT TOP (5) * FROM sys.tables;
      GO
      ```
    * **Audit**:

      ```bash
      echo "$(date '+%F %T') RESTORE AdventureWorksDW2022 completed" >> ~/mssql_changes_audit.log
      ```

**Troubleshooting**

* Access denied to data dir → verify default container paths (`/var/opt/mssql/data`).
* DB not visible in VS Code → disconnect/reconnect the profile; make sure the tunnel is up.

---

## 7) Create a **read-only** login (`ro_app`) for least privilege

1. **Create login & map DB user**

   ```bash
   read -s -p "Enter a strong password for ro_app: " RO_PASS; echo
   sqlcmd -S 127.0.0.1,11433 -U sa -P "$MSSQL_SA_PASSWORD" -C -b -Q "
     IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = N'ro_app')
       CREATE LOGIN [ro_app] WITH PASSWORD = N'$RO_PASS', CHECK_POLICY = ON, CHECK_EXPIRATION = ON;
     USE [AdventureWorksDW2022];
     IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = N'ro_app')
       CREATE USER [ro_app] FOR LOGIN [ro_app];
     EXEC sp_addrolemember N'db_datareader', N'ro_app';
     DENY INSERT, UPDATE, DELETE, ALTER, CONTROL TO [ro_app];
   "
   unset RO_PASS
   ```

    * **Purpose**: Read-only principal for day-to-day queries.
    * **Security Note**: Interactive password entry; explicit DENY on writes/DDL.
    * **Audit**:

      ```bash
      echo "$(date '+%F %T') Created ro_app RO on AdventureWorksDW2022" >> ~/mssql_changes_audit.log
      ```
2. **Test least privilege**

   ```bash
   # Expect SELECT ok; DDL denied (you’ll be prompted for ro_app pass via macOS dialog)
   sqlcmd -S 127.0.0.1,11433 -U ro_app -P "$(osascript -e 'Tell application \"System Events\" to display dialog \"Enter ro_app password\" default answer \"\" with hidden answer' -e 'text returned of result')" -C -d AdventureWorksDW2022 -Q "SELECT TOP (5) name FROM sys.tables;"
   sqlcmd -S 127.0.0.1,11433 -U ro_app -P "$(osascript -e 'Tell application \"System Events\" to display dialog \"Enter ro_app password\" default answer \"\" with hidden answer' -e 'text returned of result')" -C -d AdventureWorksDW2022 -Q "CREATE TABLE dbo._tmp_security_check (id int);"
   ```

    * **Purpose**: Proves RO access is enforced.
3. **Troubleshooting**

    * Principal cannot access DB → ensure `CREATE USER` ran in the correct DB.
    * Password policy errors → use stronger password (≥14 chars, mixed classes).

---

## 8) Optional Hardening: NetworkPolicy (restrict pod ingress)

1. **Apply a basic allow-list on 1433**

   ```bash
   kubectl -n mssql apply -f - <<'YAML'
   apiVersion: networking.k8s.io/v1
   kind: NetworkPolicy
   metadata:
     name: mssql-allow-ssh-tunnel-only
   spec:
     podSelector:
       matchLabels:
         app: mssql
     policyTypes: ["Ingress"]
     ingress:
       - from:
           - ipBlock:
               cidr: 10.0.0.0/8   # Adjust to your node/pod CIDRs
         ports:
           - protocol: TCP
             port: 1433
   YAML
   ```

    * **Purpose**: Enforces least-privilege networking.
    * **Security Note**: Tune CIDR to your cluster network.
2. **Test & Feedback**: Tunnel queries still work; disallowed sources fail.
3. **Troubleshooting**: If blocked by mistake: `kubectl -n mssql delete netpol mssql-allow-ssh-tunnel-only`.

---

## 9) Optional: Set VS Code default DB to `AdventureWorksDW2022` (UI)

1. **Update the saved connection**

   ```bash
   # (No command — VS Code UI)
   ```

    * **Connections** view → right-click **k3s-mssql-ssh** → **Edit Connection** → set **Database** to `AdventureWorksDW2022` → Save → reconnect.
2. **Test & Feedback**: New query tab:

   ```sql
   SELECT DB_NAME() AS db; 
   GO
   ```

    * Expect `AdventureWorksDW2022`.

---

## 10) Routine Ops — Start/Stop & Audit

1. **Start tunnel (daily use)**

   ```bash
   ssh -N -L 127.0.0.1:11433:10.43.112.170:1433 master-01
   ```

    * **Audit**:

      ```bash
      echo "$(date '+%F %T') tunnel up 11433->10.43.112.170:1433" >> ~/mssql_tunnel_audit.log
      ```
2. **Quick health checks**

   ```bash
   nc -vz 127.0.0.1 11433
   kubectl -n mssql get pods,svc,endpoints
   ```
3. **Stop tunnel**: `Ctrl+C` in the SSH session.

---

### Notes & Security Practices

* Keep MSSQL as **ClusterIP**; avoid NodePort/LoadBalancer for admin paths.
* Store secrets only in **K8S Secrets** and **macOS Keychain**; never in git.
* Use **read-only** logins for day-to-day work; reserve `sa` for admin tasks.
* Maintain lightweight **audit logs** for tunnel usage and DB changes.
