## **❌ Uninstalling K3S**

If you want start again from scratch then uninstallation instructions are below to completely uninstall from all nodes.

---

### **🛠️ **1. From Master****

- **Uninstall K3s on master-01:**
  ```bash
  /usr/local/bin/k3s-uninstall.sh
  ```

- **This command will remove K3s and all of its components, including the `kubectl` configuration and data files.**

---

### **🛠️ **2. From Worker Nodes****

- **Uninstall K3s on worker nodes:**
  ```bash
  /usr/local/bin/k3s-agent-uninstall.sh
  ```

- **This command will remove K3s agent and all related components from the worker nodes.**

---

### **✅ **3. Verify Uninstallation****

- **On each node, ensure that K3s has been completely removed by checking if the K3s services are no longer running:**

  ```bash
  sudo systemctl status k3s
  sudo systemctl status k3s-agent
  ```

Both commands should return "Unit k3s.service could not be found" or similar messages indicating that the services are
no longer present.

---

### 🧹 **4. Clean Up Any Leftover Configuration (Optional)** (Optional)

- If you wish to clean up any leftover configuration files or directories manually on their respective nodes, then you
  can remove them using:
  ```bash
  rm -rf /usr/local/bin/k3s
  rm -rf /etc/rancher/k3s/
  rm -rf /var/lib/rancher/k3s
  rm -rf /etc/systemd/system/k3s.service
  rm -rf /etc/systemd/system/k3s-agent.service
  ```

After completing these steps, K3s should be fully uninstalled from your nodes.

---
