# Debian Trixie “worker-02” — Always-On Wi-Fi Server Setup

## 0) Assumptions

* Debian 13 (Trixie), NetworkManager + systemd.
* Orange router provides **DHCP reservation** for this laptop’s Wi-Fi MAC (IP static on the router, not on Debian).
* You’ll SSH from macOS using **key-based auth**.
* Wi-Fi interface is **wlo1**; connection profile name is **Macaw-Tucan**.

---

## 1) Update OS + reboot

```bash
sudo apt update
sudo apt full-upgrade -y
sudo reboot
```

---

## 2) Hostname + mDNS (easy discovery from macOS)

```bash
sudo hostnamectl set-hostname worker-02
sudo apt install -y avahi-daemon
sudo systemctl enable --now avahi-daemon
```

You’ll be able to reach it as `worker-02.local` from macOS.

---

## 3) SSH server + admin user

### 3.1 Install and enable SSH

```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

### 3.2 Create admin user (if not yet)

```bash
sudo adduser aniket
sudo usermod -aG sudo aniket
```

> If you ever see `aniket is not in the sudoers file`, fix it by logging in as **root** (local console or root SSH) and:

```bash
apt update
apt install -y sudo
usermod -aG sudo aniket
visudo -c   # sanity-check sudoers
```

Log out/in (or `exec su - aniket`) so the new group applies.

### 3.3 macOS: generate an SSH key & copy it to Debian

On your Mac:

```bash
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_ed25519
ssh-copy-id aniket@worker-02.local
# (or use the reserved IP from your router)
```

### 3.4 Harden SSH (keys only; disable root passwords)

On Debian:

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F)

# Only key auth; no interactive passwords
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?KbdInteractiveAuthentication.*/KbdInteractiveAuthentication no/' /etc/ssh/sshd_config

# Permit root login but ONLY via keys (safe “break-glass”)
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config

sudo systemctl restart ssh
```

**Test from macOS:**

```bash
ssh -o IdentitiesOnly=yes aniket@worker-02.local true && echo "User SSH OK"
ssh -o IdentitiesOnly=yes root@worker-02.local uptime && echo "Root (keys-only) SSH OK"
```

> If you require password-based root login (not recommended), set `PermitRootLogin yes` and `PasswordAuthentication yes`, then `sudo systemctl restart ssh`.

---

## 4) Solid Wi-Fi: no random MACs, auto-connect, powersave off

### 4.1 Disable global scan MAC randomization

```bash
sudo mkdir -p /etc/NetworkManager/conf.d
printf '%s\n' '[device]' 'wifi.scan-rand-mac-address=no' | \
  sudo tee /etc/NetworkManager/conf.d/10-mac-scan-randomization.conf
sudo systemctl restart NetworkManager
```

### 4.2 Configure the **Macaw-Tucan** connection profile

```bash
CONN="Macaw-Tucan"

# Use permanent adapter MAC and no randomization
sudo nmcli connection modify "$CONN" 802-11-wireless.cloned-mac-address permanent
sudo nmcli connection modify "$CONN" 802-11-wireless.mac-address-randomization never

# Disable Wi-Fi powersave on this connection
sudo nmcli connection modify "$CONN" 802-11-wireless.powersave 2   # 2 = disable

# Reliable auto-connect
sudo nmcli connection modify "$CONN" connection.autoconnect yes
sudo nmcli connection modify "$CONN" connection.autoconnect-retries -1
sudo nmcli connection modify "$CONN" connection.wait-device-timeout 0

# DHCP from router (both stacks)
sudo nmcli connection modify "$CONN" ipv4.method auto
sudo nmcli connection modify "$CONN" ipv6.method auto

# Apply (briefly drops Wi-Fi)
sudo nmcli connection down "$CONN" ; sudo nmcli connection up "$CONN"
```

### 4.3 Verify the connection properties

```bash
CONN="Macaw-Tucan"
echo -n "ID: "; nmcli -g connection.id connection show "$CONN"
echo -n "TYPE: "; nmcli -g connection.type connection show "$CONN"
echo -n "AUTOCONNECT: "; nmcli -g connection.autoconnect connection show "$CONN"
echo -n "RETRIES: "; nmcli -g connection.autoconnect-retries connection show "$CONN"
echo -n "DEVICE: "; nmcli -g GENERAL.DEVICES connection show "$CONN"
echo -n "CLONED-MAC: "; nmcli -g 802-11-wireless.cloned-mac-address connection show "$CONN"
echo -n "MAC RANDOMIZATION: "; nmcli -g 802-11-wireless.mac-address-randomization connection show "$CONN"
echo -n "POWERSAVE: "; nmcli -g 802-11-wireless.powersave connection show "$CONN"
```

**Expected:**

```
ID: Macaw-Tucan
TYPE: 802-11-wireless
AUTOCONNECT: yes
RETRIES: -1
DEVICE: wlo1
CLONED-MAC: permanent
MAC RANDOMIZATION: never
POWERSAVE: disable
```

---

## 5) Keep the machine awake (AC or battery) and ignore lid

### 5.1 Tell logind to ignore lid + idle

```bash
sudo cp /etc/systemd/logind.conf /etc/systemd/logind.conf.bak.$(date +%F)
sudo sed -i 's/^#\?HandleLidSwitch.*/HandleLidSwitch=ignore/' /etc/systemd/logind.conf
sudo sed -i 's/^#\?HandleLidSwitchDocked.*/HandleLidSwitchDocked=ignore/' /etc/systemd/logind.conf
sudo sed -i 's/^#\?HandleLidSwitchExternalPower.*/HandleLidSwitchExternalPower=ignore/' /etc/systemd/logind.conf
sudo sed -i 's/^#\?IdleAction.*/IdleAction=ignore/' /etc/systemd/logind.conf
sudo systemctl restart systemd-logind
```

### 5.2 Hard-disable sleep/hibernate targets

```bash
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```

### 5.3 Make systemd-sleep inert

```bash
sudo cp /etc/systemd/sleep.conf /etc/systemd/sleep.conf.bak.$(date +%F) 2>/dev/null || true
printf '[Sleep]\nAllowSuspend=no\nAllowHibernation=no\nAllowHybridSleep=no\nAllowSuspendThenHibernate=no\n' | \
  sudo tee /etc/systemd/sleep.conf
```

**Quick checks:**

```bash
loginctl show-logind | egrep 'HandleLid|IdleAction'
systemctl status sleep.target suspend.target hibernate.target hybrid-sleep.target | sed -n '1,12p'
```

---

## 6) Force Wi-Fi powersave OFF at runtime (service)

```bash
sudo apt install -y iw  # ensure iw is present

sudo tee /etc/systemd/system/wifi-nosave.service >/dev/null <<'EOF'
[Unit]
Description=Disable WiFi power saving (wlo1)
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/sbin/iw dev wlo1 set power_save off

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now wifi-nosave.service

# Verify runtime
iw dev wlo1 get power_save   # -> Power save: off
```

---

## 7) (Optional) Wi-Fi watchdog (bounce Wi-Fi if link dies)

Checks every 5 minutes; if two pings fail from **wlo1**, it toggles Wi-Fi via NetworkManager.

```bash
# Script
sudo tee /usr/local/bin/wifi-watchdog.sh >/dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
IFACE="wlo1"
PING_HOST="1.1.1.1"

if ! ping -I "$IFACE" -c1 -W2 "$PING_HOST" >/dev/null 2>&1; then
  sleep 30
  if ! ping -I "$IFACE" -c1 -W2 "$PING_HOST" >/dev/null 2>&1; then
    /usr/bin/nmcli radio wifi off || true
    sleep 2
    /usr/bin/nmcli radio wifi on || true
  fi
fi
EOF
sudo chmod +x /usr/local/bin/wifi-watchdog.sh

# Service + timer
sudo tee /etc/systemd/system/wifi-watchdog.service >/dev/null <<'EOF'
[Unit]
Description=WiFi watchdog (bounce NM if link down on wlo1)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/wifi-watchdog.sh
EOF

sudo tee /etc/systemd/system/wifi-watchdog.timer >/dev/null <<'EOF'
[Unit]
Description=Run WiFi watchdog every 5 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
AccuracySec=1min
Unit=wifi-watchdog.service

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now wifi-watchdog.timer

# Check
systemctl status --no-pager wifi-watchdog.timer
```

---

## 8) Firewall + Fail2Ban

```bash
sudo apt install -y ufw fail2ban
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
echo "y" | sudo ufw enable

sudo systemctl enable --now fail2ban
```

> Optional hardening in `/etc/fail2ban/jail.local` and SSH limits:

```
# /etc/ssh/sshd_config additions (then systemctl restart ssh)
MaxAuthTries 3
LoginGraceTime 20
ClientAliveInterval 30
ClientAliveCountMax 3
```

---

## 9) Time sync + unattended security updates

```bash
# Time sync
timedatectl timesync-status || sudo systemctl restart systemd-timesyncd
timedatectl

# Security updates
sudo apt install -y unattended-upgrades apt-listchanges
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 10) Lid-closed connectivity test (from macOS)

Leave Debian running, then on macOS:

```bash
ssh aniket@worker-02.local 'uptime && iw dev wlo1 link && iw dev wlo1 get power_save'
```

You should see increasing uptime, your SSID `Macaw-Tucan`, and `Power save: off`.

---

## 11) macOS SSH convenience

`~/.ssh/config` on your Mac:

```sshconfig
Host worker-02
  HostName worker-02.local
  User aniket
  IdentitiesOnly yes
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30
  ServerAliveCountMax 6
```

Connect with:

```bash
ssh worker-02
```

---

## 12) BIOS tip (power returns auto-boot)

In BIOS/UEFI, enable **AC Recovery → Power On** (or similar) so the laptop boots when AC returns after an outage.

---

## 13) Optional cosmetic: keep console from blanking

```bash
sudo sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="/GRUB_CMDLINE_LINUX_DEFAULT="consoleblank=0 /' /etc/default/grub
sudo update-grub
```

---

## Rollback snippets

* Re-enable sleep:

```bash
sudo systemctl unmask sleep.target suspend.target hibernate.target hybrid-sleep.target
sudo rm -f /etc/systemd/sleep.conf
sudo systemctl restart systemd-logind
```

* Restore default SSH auth (not recommended):

```bash
sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

---

### Done

Your **worker-02** now:

* Stays awake on AC and battery, lid closed
* Keeps Wi-Fi up with **wlo1** (no MAC randomization, powersave off)
* Is reachable via SSH from your Mac (user + root key-only)
* Has UFW + Fail2Ban and unattended security updates configured

If you want to proceed, we can add remote access (Tailscale), system monitoring, or join it to your K3s cluster as a worker.
