Below is the **from-scratch, clean** setup to keep a permanent, secure `kubectl` tunnel from macOS to `master-01` using `autossh` + `launchd`. Follow **in order**. Each step includes: command(s), purpose, security note, **Test & Feedback**, and **Troubleshooting**.

---

1. **Prereqs on macOS: Homebrew + autossh**

   ```bash
   brew install autossh
   command -v autossh && autossh -V
   ```

    * **Purpose**: Install the auto-healing SSH client we’ll run under `launchd`.
    * **Security Note**: Keep Homebrew up to date; autossh runs as your user.
    * **Test & Feedback**: Confirm paths print (e.g., `/opt/homebrew/bin/autossh`) and version shows (e.g., `autossh 1.4g`).
      Report if not.
    * **Troubleshooting**: If `brew: command not found`, install Homebrew, then re-run:

      ```bash
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && eval "$(/opt/homebrew/bin/brew shellenv)"
      ```

---

2. **Harden and normalize SSH config (macOS-friendly defaults)**

   ```bash
   install -d -m700 ~/.ssh
   cp -v ~/.ssh/config ~/.ssh/config.bak.$(date +%F-%H%M%S) 2>/dev/null || true
   cat > ~/.ssh/config <<'SSHCONF'
   Host *
     ServerAliveInterval 30
     ServerAliveCountMax 3
     IdentitiesOnly yes
     AddKeysToAgent yes
     UseKeychain yes
     StrictHostKeyChecking accept-new

   Host cloud-vm
     HostName ec2-13-38-107-231.eu-west-3.compute.amazonaws.com
     User admin
     Port 22
     IdentityFile ~/.ssh/cloud-vm.pem

   Host master-01
     HostName 192.168.15.2
     User root
     Port 22
     IdentityFile ~/.ssh/id_ed25519

   Host worker-01
     HostName 192.168.15.3
     User root
     Port 22
     IdentityFile ~/.ssh/id_ed25519
   SSHCONF
   chmod 600 ~/.ssh/config
   ```

    * **Purpose**: Enforce keepalives, key pinning, macOS Keychain usage; define hosts.
    * **Security Note**: `IdentitiesOnly yes` prevents offering unintended keys; `accept-new` pins host keys on first connect.
    * **Test & Feedback**:

      ```bash
      ssh -G master-01 | egrep 'hostname|user|identityfile|serveralive|identitiesonly|usekeychain|addkeystoagent' | sort
      ```

      Ensure it shows `hostname 192.168.15.2`, `user root`, `identityfile ~/.ssh/id_ed25519`. Share if not.
    * **Troubleshooting**: If host isn’t reachable, ensure network/VPN to `192.168.15.2`.

---

3. **Load the private key into macOS Keychain (non-interactive SSH)**

   ```bash
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ssh master-01 true
   ```

    * **Purpose**: Let `launchd`/ssh unlock your key without prompts.
    * **Security Note**: Keep `~/.ssh` at `700`, private key at `600`, use a strong passphrase.
    * **Test & Feedback**: `ssh master-01 true` must exit **with no prompt** and code 0. Report if it prompts.
    * **Troubleshooting**:

        * If prompted: verify key path, run `chmod 600 ~/.ssh/id_ed25519 ~/.ssh/config`.
        * If permission denied: install your public key on the server:

          ```bash
          cat ~/.ssh/id_ed25519.pub | ssh root@192.168.15.2 'install -d -m700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
          ```

---

4. **Confirm the API server’s bind (for correct remote target)**

   ```bash
   ssh master-01 'ss -tlpn | grep 6443 || netstat -tlpn 2>/dev/null | grep 6443'
   ```

    * **Purpose**: Verify K3S API listens (commonly `*:6443`); we’ll forward to `127.0.0.1:6443` first.
    * **Security Note**: We do **local** forwarding only; no exposure on macOS or WAN.
    * **Test & Feedback**: Ensure a `LISTEN` line appears. If none, check `systemctl status k3s`.
    * **Troubleshooting**: If not listening, fix K3S before continuing.

---

5. **Create a persistent background tunnel with `launchd`**

   ```bash
   mkdir -p ~/Library/LaunchAgents
   cat > ~/Library/LaunchAgents/com.k3s.apitunnel.plist <<'PLIST'
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0"><dict>
     <key>Label</key><string>com.k3s.apitunnel</string>
     <key>ProgramArguments</key>
     <array>
       <string>/opt/homebrew/bin/autossh</string>
       <string>-M</string><string>0</string>
       <string>-N</string>
       <string>-o</string><string>ExitOnForwardFailure=yes</string>
       <string>-L</string><string>6443:127.0.0.1:6443</string>
       <string>master-01</string>
     </array>
     <key>RunAtLoad</key><true/>
     <key>KeepAlive</key>
     <dict>
       <key>SuccessfulExit</key><false/>
       <key>NetworkState</key><true/>
     </dict>
     <key>LimitLoadToSessionType</key><string>Aqua</string>
     <key>StandardOutPath</key><string>/tmp/k3s-apitunnel.out</string>
     <key>StandardErrorPath</key><string>/tmp/k3s-apitunnel.err</string>
   </dict></plist>
   PLIST
   chmod 644 ~/Library/LaunchAgents/com.k3s.apitunnel.plist
   launchctl unload -w ~/Library/LaunchAgents/com.k3s.apitunnel.plist 2>/dev/null || true
   launchctl load  -w ~/Library/LaunchAgents/com.k3s.apitunnel.plist
   ```

    * **Purpose**: Auto-starts and self-heals the tunnel at login: `localhost:6443` → `master-01:127.0.0.1:6443`.
    * **Security Note**: Only binds on **your Mac’s** localhost; no external exposure.
    * **Test & Feedback**:

      ```bash
      launchctl print gui/$(id -u)/com.k3s.apitunnel | sed -n '1,120p'
      lsof -nP -iTCP:6443 -sTCP:LISTEN || true
      nc -vz 127.0.0.1 6443
      ```

      Expect the agent printed, port 6443 listening, and `nc` “succeeded”. Share if not.
    * **Troubleshooting**:

        * If `nc` is refused, adjust the remote target to node IP (some setups need this):

          ```bash
          /usr/bin/sed -i '' 's/6443:127\.0\.0\.1:6443/6443:192.168.15.2:6443/' ~/Library/LaunchAgents/com.k3s.apitunnel.plist
          launchctl unload -w ~/Library/LaunchAgents/com.k3s.apitunnel.plist
          launchctl load  -w ~/Library/LaunchAgents/com.k3s.apitunnel.plist
          ```

---

6. **Use the tunnel with kubectl (reusing your existing kubeconfig)**

   ```bash
   # If your current context already uses https://127.0.0.1:6443, just test:
   kubectl --request-timeout=5s cluster-info
   kubectl get nodes -o wide
   ```

    * **Purpose**: Validate cluster access via the permanent tunnel.
    * **Security Note**: Kubeconfig files stay `chmod 600`; avoid sharing them.
    * **Test & Feedback**: You should see API URLs and nodes listed. If you get `x509` or timeout, see troubleshooting.
    * **Troubleshooting**:

        * **Timeout**: Check Step 5 `nc`. If refused, switch remote target to `192.168.15.2` as shown above.
        * **x509 SAN mismatch**: Your kubeconfig server URL is not `https://127.0.0.1:6443`. Either:

            * Temporarily run:

              ```bash
              kubectl config set-cluster "$(kubectl config current-context | sed 's/-context$//')" --server=https://127.0.0.1:6443
              ```
            * Or create a **separate context** later (see Optional Step 7).

---

7. **(Optional) Create a dedicated localhost context for the tunnel**

   ```bash
   NEWCTX="k3s-homelab-tunnel"
   # Reuse cluster CA and user creds from your current admin context:
   CA="$(kubectl config view -o jsonpath='{.clusters[0].cluster.certificate-authority}' 2>/dev/null)"
   TOKEN="$(kubectl config view -o jsonpath='{.users[0].user.token}' 2>/dev/null)"
   kubectl config set-cluster "$NEWCTX" --server=https://127.0.0.1:6443 ${CA:+--certificate-authority="$CA"}
   [ -n "$TOKEN" ] && kubectl config set-credentials "$NEWCTX" --token="$TOKEN" || true
   kubectl config set-context "$NEWCTX" --cluster="$NEWCTX" --user="${TOKEN:+$NEWCTX}"
   kubectl config use-context "$NEWCTX"
   ```

    * **Purpose**: Keep your original context untouched and have a context that always targets the tunnel.
    * **Security Note**: Do not echo tokens on screen/logs. Ensure `~/.kube/config` is `600`.
    * **Test & Feedback**: `kubectl get nodes` should work under the new context.

---

8. **(Optional hardening) Replace `root` with a least-privilege tunnel user**

   ```bash
   # On master-01 (Debian): create a restricted account for port forwarding only
   adduser --system --home /nonexistent --shell /usr/sbin/nologin k3stun
   install -d -m700 -o k3stun -g k3stun /home/k3stun/.ssh
   echo "<YOUR_PUBLIC_KEY>" >> /home/k3stun/.ssh/authorized_keys
   chmod 600 /home/k3stun/.ssh/authorized_keys
   chown -R k3stun:k3stun /home/k3stun/.ssh

   # Restrict the account in sshd
   printf '\nMatch User k3stun\n  AllowTcpForwarding yes\n  X11Forwarding no\n  PermitTTY no\n  ForceCommand echo "Port forward only"; sleep 99999\n' | sudo tee -a /etc/ssh/sshd_config
   systemctl reload ssh
   ```

    * **Purpose**: Principle of least privilege; block shell/TTY, allow forward only.
    * **Security Note**: Consider `from="your.mac.ip"` restriction on the authorized_keys line.
    * **Test & Feedback**: Temporarily change the plist’s last argument to `k3stun@master-01`, reload agent, and re-test `nc`/`kubectl`.

---

### Logging & Auditing

* **macOS**: Keep `~/Library/LaunchAgents/com.k3s.apitunnel.plist` in your dotfiles repo; rotate keys periodically. Logs: `/tmp/k3s-apitunnel.out` and `/tmp/k3s-apitunnel.err`.
* **Server**: Track `/etc/ssh/sshd_config` changes; `journalctl -u k3s --since today` for API events.

---

### Common Errors (Quick Fix)

* **`nc 127.0.0.1 6443` refused** → Change remote target to `192.168.15.2` in the plist, reload agent.
* **SSH prompts when started by launchd** → Ensure `UseKeychain yes` + `ssh-add --apple-use-keychain <key>`.
* **`x509: certificate ... not 127.0.0.1`** → Point the kube **context** to `https://127.0.0.1:6443` (Step 6/7).
* **Agent missing after reboot** → Confirm plist path and perms, then `launchctl load -w ...`.
* **Port already used on Mac** → Change local port (e.g., `16443`) in plist; update kube context accordingly.
