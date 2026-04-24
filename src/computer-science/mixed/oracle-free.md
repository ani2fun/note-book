Here’s a compact reference doc you can keep for your setup 👇

---

# Oracle Cloud Always Free – k3s Cluster Reference

## 1. Overall Design

You will use:

* **2× `VM.Standard.A1.Flex`** (Arm, main k3s nodes)

    * **Node 1:** k3s master (control-plane) + light workloads
    * **Node 2:** k3s worker (main workloads)
* **2× `VM.Standard.E2.1.Micro`** (x86, side nodes)

    * **Node 3:** tiny amd64 worker (for x86-only pods or utilities)
    * **Node 4:** bastion/utility (optionally a worker)

All 4 VMs stay within **Always Free** as long as you respect:

* **A1.Flex budget:** total **≤ 4 OCPUs** and **≤ 24 GB RAM**
* **Block storage:** total **≤ 200 GB** (all boot + data volumes, all instances)
* **Micro VMs:** max **2× `VM.Standard.E2.1.Micro`**

---

## 2. Recommended A1.Flex Configuration (Arm)

### Node A (Master / Control-plane)

* **Shape:** `VM.Standard.A1.Flex`
* **OCPUs:** `1`
* **Memory:** `8 GB`
* **Boot volume:** `50 GB`
* **Role:**

    * k3s server (control-plane)
    * CoreDNS, Ingress controller, cluster add-ons
    * Light workloads only (keep it mostly for control-plane reliability)

### Node B (Worker)

* **Shape:** `VM.Standard.A1.Flex`
* **OCPUs:** `3`
* **Memory:** `16 GB`
* **Boot volume:** `50 GB` (or more if you want)
* **Role:**

    * Main worker node for most workloads
    * Databases, apps, monitoring, etc.

**A1 totals:**

* OCPUs: **1 + 3 = 4**
* RAM: **8 + 16 = 24 GB**
  ✅ Fully uses your **free A1 quota** without exceeding it.

---

## 3. E2.1.Micro Configuration (x86)

### Node C (Small amd64 worker)

* **Shape:** `VM.Standard.E2.1.Micro`
* **CPU/RAM:** 1 micro OCPU, 1 GB RAM (fixed)
* **Boot volume:** `50 GB`
* **Role:**

    * Join as **amd64 k3s worker**
    * Run **x86-only** or very lightweight workloads
* **Tip:** Label it:

    * `kubernetes.io/arch=amd64`
    * `node-type=micro`

### Node D (Bastion / Utility)

* **Shape:** `VM.Standard.E2.1.Micro`
* **CPU/RAM:** same as above
* **Boot volume:** `50 GB`
* **Role options:**

    * SSH jump box / admin node
    * Small utility services (backup scripts, registries, exporters)
    * Optional k3s worker
* **Tip:** You can **taint** it so regular workloads don’t schedule here:

  ```bash
  kubectl taint nodes <node-name> role=bastion:NoSchedule
  ```

**Storage check:**

* A1: 50 + 50 = 100 GB
* Micros: 50 + 50 = 100 GB
* **Total = 200 GB** → exactly the free storage limit.

---

## 4. Mixed-Architecture Cluster Notes

Your cluster will be **mixed Arm + x86**:

* **A1.Flex nodes:** `arm64`
* **E2.1.Micro nodes:** `amd64`

Kubernetes itself is fine with this; you just need to handle images correctly.

### Labels (usually auto-added)

* `kubernetes.io/arch=arm64` on A1 nodes
* `kubernetes.io/arch=amd64` on Micro nodes

### Scheduling examples

Run a pod only on Arm (A1):

```yaml
spec:
  template:
    spec:
      nodeSelector:
        kubernetes.io/arch: arm64
```

Run a pod only on x86 (Micro):

```yaml
spec:
  template:
    spec:
      nodeSelector:
        kubernetes.io/arch: amd64
```

Prefer **multi-arch images** (`linux/arm64,linux/amd64`) for apps that should run anywhere.

---

## 5. High-Level Setup Steps (k3s)

1. **Create the 4 instances** with the shapes and sizes above.
2. **Install k3s server** on A1 Master:

   ```bash
   curl -sfL https://get.k3s.io | sh -
   ```
3. **Get the k3s token** from the master:

   ```bash
   sudo cat /var/lib/rancher/k3s/server/node-token
   ```
4. **Join A1 Worker and the two Micros** as agents:

   ```bash
   curl -sfL https://get.k3s.io | K3S_URL="https://<MASTER_IP>:6443" K3S_TOKEN="<TOKEN>" sh -
   ```
5. Verify:

   ```bash
   kubectl get nodes -o wide
   ```

---

## 6. Quick “Rules of Thumb” for You

* Don’t go above **4 total A1 OCPUs** or **24 GB RAM**.
* Don’t exceed **200 GB** total block storage in the region.
* Use **A1 nodes for almost everything**.
* Use **Micro nodes only when you specifically need x86** or for tiny utilities.
* Use **nodeSelector / affinity** to control where pods run.

---

If you want, I can turn this into a Markdown file skeleton you can paste into your own repo/notes (with TODOs for your actual IPs, hostnames, etc.).
