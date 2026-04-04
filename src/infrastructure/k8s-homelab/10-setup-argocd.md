# Argo CD Deployment Guide for This Homelab Cluster

> Current note
> This is a detailed historical deep dive. For the current Argo CD path, start with [01-platform-overview.md](01-platform-overview.md) and [06-platform-services-step-by-step.md](06-platform-services-step-by-step.md).

## Table of Contents

1. [Overview](#overview)
2. [What This Document Covers](#what-this-document-covers)
3. [Goal](#goal)
4. [Current Cluster Context](#current-cluster-context)
5. [Important Design Decisions](#important-design-decisions)
6. [Concepts Explained for Beginners](#concepts-explained-for-beginners)
7. [Step-by-Step Implementation](#step-by-step-implementation)
8. [Validation Checklist](#validation-checklist)
9. [Troubleshooting](#troubleshooting)
10. [Mistakes and Corrections](#mistakes-and-corrections)
11. [Operational and Security Notes](#operational-and-security-notes)
12. [Next Steps](#next-steps)
13. [Glossary](#glossary)
14. [Further Learning](#further-learning)

---

## Overview

This document explains how Argo CD was deployed on the current homelab Kubernetes cluster in a way that matches the cluster’s existing design patterns.

The deployment was not treated as a brand-new, generic Kubernetes tutorial. Instead, it was adapted to the cluster that already existed:

* Argo CD was installed into its own namespace
* its workloads were scheduled onto the `wk-2` node
* it was exposed using the same **standard Kubernetes Ingress pattern** already used for existing applications like notebook and portfolio
* TLS was terminated by Traefik at the edge
* the existing cert-manager issuer pattern was reused

---

## What This Document Covers

This document reconstructs the discussion and actions taken in the document and turns them into a self-contained technical guide. It explains:

* what was deployed
* why those decisions were made
* which options were considered and rejected
* which commands were run
* where those commands should be run
* how to verify success
* how to troubleshoot common issues

---

## Goal

The goal was to deploy **Argo CD** on the existing cluster and make sure it follows the same cluster conventions as the already deployed applications.

More specifically, the desired outcome was:

* install Argo CD in namespace `argocd`
* schedule Argo CD workloads onto `wk-2`
* expose the Argo CD web UI using **Traefik**
* use a **standard Kubernetes Ingress**
* reuse the same TLS pattern as notebook and portfolio
* keep the deployment operationally consistent with the rest of the homelab

---

## Current Cluster Context

The cluster context inferred from the document is:

* Kubernetes distribution: **K3s**
* `ms-1` is the main server node where `kubectl` commands were being run
* `wk-2` is the node selected to host the Argo CD workloads
* Traefik is the ingress controller
* existing applications such as notebook and portfolio already use:

    * `Ingress`
    * `ingressClassName: traefik`
    * cert-manager
    * TLS secrets managed through cert-manager
* DNS already points `argocd.kakde.eu` to the public edge
* the public edge is already working
* the Argo CD deployment ended in a healthy state

---

## Important Design Decisions

Several important design choices were made during the conversation.

### 1. Use `wk-2` for Argo CD workloads

The request was to use `wk-2` for the deployment. In Kubernetes, this does not mean “install Argo CD separately on that machine” in the traditional sense. It means the Argo CD pods should be **scheduled onto that node**.

This was achieved through a **node label** and a **nodeSelector**.

### 2. Use standard Kubernetes `Ingress`, not Traefik `IngressRoute`

At one point, exposing Argo CD through Traefik’s `IngressRoute` CRD was considered.

That was rejected in favor of standard `Ingress` because:

* notebook and portfolio already use standard `Ingress`
* consistency matters
* standard Kubernetes objects are easier to understand for beginners
* this keeps manifests more portable
* the cluster already follows this pattern successfully

### 3. Reuse the same TLS pattern as notebook and portfolio

The existing notebook ingress used:

* `ingressClassName: traefik`
* `cert-manager.io/cluster-issuer: letsencrypt-prod-dns01`
* Traefik annotations for `websecure` and TLS
* a dedicated secret name for TLS

So Argo CD was configured to use exactly the same approach.

### 4. Disable Argo CD internal TLS

Argo CD’s `argocd-server` can serve HTTPS itself, but in this cluster, TLS is already terminated at Traefik.

So the Argo CD server was set to:

```yaml
server.insecure: "true"
```

This means:

* Argo CD serves plain HTTP **inside the cluster**
* Traefik handles HTTPS **at the ingress edge**
* this matches how reverse-proxy-based deployments are commonly done

### 5. Keep browser UI public, treat CLI carefully

Argo CD has two major access patterns:

* browser UI
* CLI

The UI works cleanly behind standard Ingress.

The CLI can be trickier because Argo CD uses **gRPC** in addition to HTTP. Because of that, the deployment guidance noted that CLI access may need:

* `--grpc-web`
* or `kubectl port-forward`

---

## Why Argo CD Was Deployed This Way

This deployment was intentionally designed to match the cluster’s existing operational habits rather than introduce a new style just for Argo CD.

That is an important infrastructure principle:

> A good cluster is not only functional. It is also consistent.

If notebook and portfolio already use a certain ingress and certificate pattern, then using the same pattern for Argo CD makes the environment:

* easier to operate
* easier to document
* easier to troubleshoot
* easier for a beginner to understand

---

## Concepts Explained for Beginners

### What is Argo CD?

Argo CD is a GitOps tool for Kubernetes.

GitOps means:

* application definitions live in Git
* Argo CD watches Git
* Argo CD makes the cluster match the desired state from Git

Instead of manually applying YAML files forever, Argo CD can continuously manage applications for the cluster.

### What is a Kubernetes namespace?

A namespace is a logical area inside the cluster used to separate resources.

Examples:

* one namespace for Argo CD
* another namespace for notebook
* another namespace for portfolio

This keeps applications organized.

### What is a node?

A node is one machine in the Kubernetes cluster.

Examples from this setup:

* `ms-1`
* `wk-1`
* `wk-2`

Pods run on nodes.

### What is a label?

A label is a key-value tag attached to a Kubernetes object.

Example:

```bash
kubectl label node wk-2 workload=argocd --overwrite
```

This adds the label:

* key: `workload`
* value: `argocd`

### What is a nodeSelector?

A nodeSelector tells Kubernetes to run a pod only on nodes that have a matching label.

If a pod has:

```yaml
nodeSelector:
  workload: argocd
```

then Kubernetes will only schedule it onto nodes with:

```yaml
workload=argocd
```

### What is an Ingress?

An Ingress is a Kubernetes object that defines how external HTTP/HTTPS traffic reaches services inside the cluster.

In this setup:

* browser visits `https://argocd.kakde.eu`
* Traefik receives that request
* Traefik uses the Ingress rules
* traffic is sent to the `argocd-server` service

### What is Traefik?

Traefik is the ingress controller used by the cluster.

It watches Kubernetes Ingress objects and routes web traffic to the right services.

### What is TLS?

TLS is what gives HTTPS encryption.

It protects traffic between a user’s browser and the public endpoint.

### What is cert-manager?

cert-manager is a Kubernetes tool that automatically obtains and renews TLS certificates.

In this cluster, it uses the issuer:

```text
letsencrypt-prod-dns01
```

### What does `server.insecure: "true"` mean?

It means Argo CD’s internal server does not serve HTTPS itself.

That sounds scary at first, but in this design it is intentional because:

* internal traffic stays inside the cluster
* external TLS is handled by Traefik
* the browser still uses HTTPS publicly

---

## Deployment Flow Summary

The deployment sequence was:

1. verify the cluster and nodes
2. label `wk-2`
3. install Argo CD into the `argocd` namespace
4. confirm Argo CD pods started
5. patch Argo CD workloads with `nodeSelector`
6. restart them so they move to `wk-2`
7. verify all pods now run on `wk-2`
8. patch `argocd-cmd-params-cm` to set `server.insecure: "true"`
9. restart `argocd-server`
10. inspect existing notebook ingress
11. create a matching Argo CD ingress
12. verify DNS, certificate issuance, ingress health, and external access
13. retrieve the initial admin password
14. confirm healthy access

---

## Step-by-Step Implementation

## Step 1: Verify the Cluster

### Purpose

Before changing anything, confirm the cluster is reachable and the nodes exist.

### Where to run

Run on a machine that already has working `kubectl` access to the cluster.
In the document, commands were run from:

* `ms-1`

### Commands

```bash
kubectl get nodes -o wide
kubectl get pods -A
```

### What these commands do

* `kubectl get nodes -o wide` shows cluster nodes and more details such as IPs
* `kubectl get pods -A` shows pods in all namespaces

### Good result

* all expected nodes are present
* `wk-2` is in `Ready` state
* the cluster responds normally

---

## Step 2: Label `wk-2` for Argo CD

### Purpose

Argo CD workloads need to be scheduled onto `wk-2`. To do that, the node must receive a label.

### Where to run

Run on `ms-1` or any machine with working `kubectl`.

### Commands

```bash
kubectl label node wk-2 workload=argocd --overwrite
kubectl get nodes --show-labels | grep wk-2
```

### What these commands do

* the first command adds or updates the label `workload=argocd` on node `wk-2`
* the second command verifies the label is present

### Good result

The output for `wk-2` includes:

```text
workload=argocd
```

---

## Step 3: Install Argo CD

### Purpose

Install the standard Argo CD components into a dedicated namespace.

### Where to run

Run on `ms-1` or any machine with `kubectl` access.

### Commands

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### What these commands do

* the first command creates the `argocd` namespace
* the second applies the official Argo CD installation manifest into that namespace

### Verification

```bash
kubectl -n argocd get deploy,statefulset,svc
kubectl -n argocd get pods -o wide
```

### Good result

The output should show resources such as:

* `argocd-server`
* `argocd-repo-server`
* `argocd-dex-server`
* `argocd-redis`
* `argocd-applicationset-controller`
* `argocd-notifications-controller`
* `argocd-application-controller`

Initially, these may run on another node such as `wk-1`. That is normal before pinning.

---

## Step 4: Pin Argo CD Workloads to `wk-2`

### Purpose

Make Kubernetes place Argo CD pods on `wk-2`.

### Important note

A first attempt used:

```bash
kubectl patch ... --all
```

That failed in this environment because this `kubectl` build did not support that flag in the way it was being used.

So the fix was to patch each workload explicitly, one by one.

### Where to run

Run on `ms-1`.

### Commands

#### Patch Deployments

```bash
kubectl -n argocd patch deployment argocd-applicationset-controller --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'

kubectl -n argocd patch deployment argocd-dex-server --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'

kubectl -n argocd patch deployment argocd-notifications-controller --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'

kubectl -n argocd patch deployment argocd-redis --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'

kubectl -n argocd patch deployment argocd-repo-server --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'

kubectl -n argocd patch deployment argocd-server --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'
```

#### Patch StatefulSet

```bash
kubectl -n argocd patch statefulset argocd-application-controller --type merge -p '{"spec":{"template":{"spec":{"nodeSelector":{"workload":"argocd"}}}}}'
```

### Verify the nodeSelector was added

```bash
kubectl -n argocd get deployment argocd-applicationset-controller -o yaml | grep -A5 nodeSelector
kubectl -n argocd get deployment argocd-server -o yaml | grep -A5 nodeSelector
kubectl -n argocd get statefulset argocd-application-controller -o yaml | grep -A5 nodeSelector
```

### Good result

You should see:

```yaml
nodeSelector:
  workload: argocd
```

### Restart workloads to move the pods

```bash
kubectl -n argocd rollout restart deployment argocd-applicationset-controller
kubectl -n argocd rollout restart deployment argocd-dex-server
kubectl -n argocd rollout restart deployment argocd-notifications-controller
kubectl -n argocd rollout restart deployment argocd-redis
kubectl -n argocd rollout restart deployment argocd-repo-server
kubectl -n argocd rollout restart deployment argocd-server
kubectl -n argocd rollout restart statefulset argocd-application-controller
```

### Watch the pods move

```bash
kubectl -n argocd get pods -o wide -w
```

Press `Ctrl+C` when stable.

### Final verification

```bash
kubectl -n argocd get pods -o wide
```

### Good result

All main Argo CD pods should show:

```text
NODE   wk-2
```

The user later confirmed this was verified successfully.

---

## Step 5: Disable Internal TLS on `argocd-server`

### Purpose

Since Traefik handles external HTTPS, Argo CD itself should serve HTTP internally.

### Where to run

Run on `ms-1`.

### Command

```bash
kubectl -n argocd patch configmap argocd-cmd-params-cm --type merge -p '{"data":{"server.insecure":"true"}}'
```

### What it does

This updates the ConfigMap used by Argo CD’s server process and sets:

```yaml
server.insecure: "true"
```

### Restart the Argo CD server

```bash
kubectl -n argocd rollout restart deployment argocd-server
kubectl -n argocd rollout status deployment argocd-server
kubectl -n argocd get cm argocd-cmd-params-cm -o yaml | grep server.insecure
```

### Good result

The output includes:

```text
server.insecure: "true"
```

The user confirmed this worked successfully.

---

## Step 6: Reuse the Existing Ingress Pattern

### Purpose

Before creating the Argo CD ingress, inspect an existing app ingress to match its structure.

### Existing notebook ingress pattern

The existing notebook app ingress used:

* `ingressClassName: traefik`
* `cert-manager.io/cluster-issuer: letsencrypt-prod-dns01`
* `kubernetes.io/ingress.class: traefik`
* `traefik.ingress.kubernetes.io/router.entrypoints: websecure`
* `traefik.ingress.kubernetes.io/router.tls: "true"`
* a host-specific TLS secret

### Example inspection command

```bash
kubectl -n apps-prod get ingress notebook-app -o yaml
```

### Decision made

Argo CD should follow the same pattern.

---

## Step 7: Create the Argo CD Ingress

### Purpose

Expose Argo CD’s web interface publicly using the same Traefik + cert-manager Ingress model already used in the cluster.

### Where to run

Run on `ms-1`.

### Manifest

Create the file:

```bash
cat > /root/deployment/argocd-ingress.yaml <<'EOF'
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server
  namespace: argocd
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod-dns01
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  ingressClassName: traefik
  rules:
    - host: argocd.kakde.eu
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  number: 80
  tls:
    - hosts:
        - argocd.kakde.eu
      secretName: argocd-kakde-eu-tls
EOF
```

Apply it:

```bash
kubectl apply -f /root/deployment/argocd-ingress.yaml
kubectl -n argocd get ingress
kubectl -n argocd describe ingress argocd-server
```

### Line-by-line explanation

#### `kind: Ingress`

Defines a Kubernetes ingress resource.

#### `namespace: argocd`

Places the ingress in the Argo CD namespace.

#### `cert-manager.io/cluster-issuer: letsencrypt-prod-dns01`

Tells cert-manager which issuer to use for generating the TLS certificate.

#### `kubernetes.io/ingress.class: traefik`

Legacy-style annotation indicating the ingress controller.

#### `traefik.ingress.kubernetes.io/router.entrypoints: websecure`

Tells Traefik to expose this route on the secure HTTPS entrypoint.

#### `traefik.ingress.kubernetes.io/router.tls: "true"`

Tells Traefik to use TLS for this route.

#### `ingressClassName: traefik`

The modern Kubernetes field that explicitly binds the Ingress to the Traefik controller.

#### `host: argocd.kakde.eu`

The public hostname for the Argo CD UI.

#### `service.name: argocd-server`

The internal service receiving the traffic.

#### `port.number: 80`

Traffic is sent to service port 80 because Argo CD internal TLS was disabled.

#### `secretName: argocd-kakde-eu-tls`

The Kubernetes secret where cert-manager stores the generated TLS certificate.

---

## Step 8: Verify Certificate and DNS

### Purpose

Confirm that DNS is correct and cert-manager successfully issued the certificate.

### DNS check

Run from a machine that can resolve public DNS, such as `ms-1` or a local workstation.

```bash
dig +short argocd.kakde.eu
```

### Good result

The output should resolve to the public edge IP.

The user confirmed DNS was correct.

### Certificate verification

```bash
kubectl -n argocd get certificate,certificaterequest,order,challenge
kubectl -n argocd get secret argocd-kakde-eu-tls
```

### Good result

* certificate resources appear healthy
* the TLS secret exists

The user confirmed all of this was healthy.

---

## Step 9: Access the Web UI

### Purpose

Confirm the Argo CD web interface is reachable over HTTPS.

### From a client machine

For example, from a Mac or Linux workstation:

```bash
curl -Ik https://argocd.kakde.eu
```

### Good result

Expected HTTP codes include:

* `200`
* `301`
* `302`

Any of these usually indicates that Traefik and Argo CD are responding correctly.

Then open in a browser:

```text
https://argocd.kakde.eu
```

The user confirmed this verification passed.

---

## Step 10: Get the Initial Admin Password

### Purpose

Argo CD creates an initial admin password stored in a Kubernetes secret.

### Where to run

Run on `ms-1` or any machine with `kubectl`.

### Command

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo
```

### What it does

* fetches the secret
* extracts the `password` field
* decodes it from base64
* prints it as plain text

### Login credentials

* username: `admin`
* password: output of the command above

After first login, the password should be changed.

---

## Step 11: CLI Access

### Purpose

Access Argo CD from the command line.

### Important note

The Argo CD CLI may need special handling because Argo CD uses gRPC in addition to HTTP.

### Option 1: Try `--grpc-web`

Run from the machine where the Argo CD CLI is installed:

```bash
argocd login argocd.kakde.eu --grpc-web
```

### Option 2: Use port-forward

This is often the most reliable option for homelabs.

Run on `ms-1`:

```bash
kubectl -n argocd port-forward svc/argocd-server 8080:80
```

Then on the same machine or another shell:

```bash
argocd login localhost:8080 --insecure
```

### Good result

The CLI authenticates successfully.

---

## Quick Reinstall Reference

If you need to reinstall Argo CD from scratch, the scripted path is:

```bash
bash k8s-cluster/platform/argocd/install-argocd.sh
bash k8s-cluster/platform/argocd/configure-argocd.sh
```

Those two scripts cover everything the step-by-step section above explains manually: installation, node pinning, internal TLS disable, ingress, and Application objects.

---

## Validation Checklist

A beginner can use this checklist to confirm the deployment is truly complete.

### Argo CD installation

* `argocd` namespace exists
* deployments and statefulset exist
* services exist

### Scheduling

* `wk-2` has label `workload=argocd`
* Argo CD workloads contain `nodeSelector`
* Argo CD pods are running on `wk-2`

### Server configuration

* `argocd-cmd-params-cm` contains `server.insecure: "true"`
* `argocd-server` restarted successfully

### Ingress

* Argo CD ingress exists in namespace `argocd`
* ingress uses `ingressClassName: traefik`
* host is `argocd.kakde.eu`

### Certificate and DNS

* DNS resolves correctly
* cert-manager objects are healthy
* TLS secret exists
* `curl -Ik https://argocd.kakde.eu` succeeds

### Access

* browser opens Argo CD UI
* initial admin password can be retrieved
* CLI works through `--grpc-web` or port-forward

---

## Troubleshooting

## Problem: `kubectl patch --all` failed

### Symptom

An attempted patch command returned:

```text
error: unknown flag: --all
```

### Cause

This `kubectl` environment did not support the command form being used.

### Fix

Patch each deployment and statefulset individually.

---

## Problem: Argo CD pods are healthy but run on `wk-1`

### Cause

Argo CD was installed before scheduling rules were applied.

### Fix

* label `wk-2`
* add `nodeSelector`
* restart workloads

### Check

```bash
kubectl -n argocd get pods -o wide
```

---

## Problem: Pod stays Pending after adding nodeSelector

### Possible causes

* label not present on `wk-2`
* not enough resources on `wk-2`
* taints on `wk-2`

### Commands

```bash
kubectl get nodes --show-labels | grep wk-2
kubectl describe node wk-2
kubectl -n argocd describe pod <pod-name>
```

---

## Problem: Argo CD UI does not load over HTTPS

### Possible causes

* ingress not created correctly
* DNS not pointing to the public edge
* cert-manager failed to issue certificate
* Traefik not reading the ingress
* wrong service port in ingress

### Checks

```bash
kubectl -n argocd get ingress
kubectl -n argocd describe ingress argocd-server
dig +short argocd.kakde.eu
kubectl -n argocd get certificate,certificaterequest,order,challenge
kubectl -n argocd get secret argocd-kakde-eu-tls
curl -Ik https://argocd.kakde.eu
```

---

## Problem: Browser works but CLI has issues

### Cause

Argo CD CLI may need gRPC-specific handling.

### Fix options

Try:

```bash
argocd login argocd.kakde.eu --grpc-web
```

Or use port-forward:

```bash
kubectl -n argocd port-forward svc/argocd-server 8080:80
argocd login localhost:8080 --insecure
```

---

## Mistakes and Corrections

This section is important because it teaches beginners that infrastructure work often involves small corrections.

### 1. Initial recommendation considered `IngressRoute`

At first, a Traefik-native `IngressRoute` approach was suggested.

### Why that changed

The user clarified that notebook and portfolio already use normal Kubernetes `Ingress`, and they wanted similar design decisions and deployment patterns.

### Final decision

Use standard `Ingress` with `ingressClassName: traefik`.

---

### 2. Initial bulk patching approach failed

The attempted use of `kubectl patch --all` failed.

### Final fix

Patch resources individually.

This turned out to be safer and clearer anyway.

---

### 3. Argo CD workloads initially ran on `wk-1`

That was expected after installation because node scheduling had not yet been constrained.

### Final fix

* label `wk-2`
* patch workloads
* restart them
* verify movement to `wk-2`

---

## Operational and Security Notes

* Argo CD is a core platform service. The hostname `argocd.kakde.eu` should remain stable.
* Future app deployments should be managed through Argo CD rather than manual `kubectl apply`.
* If node labels are changed later, Argo CD scheduling may break.
* Public HTTPS is terminated at Traefik. Argo CD internal TLS is disabled on purpose, but only inside the cluster.
* The default `admin` password must be changed after first login.
* CLI access over port-forward is often safer for administrative use than depending only on public access.

---

## Assumptions and Open Questions

The following items were either assumed or not fully explored in the document.

### Assumptions

* Traefik is already installed and healthy
* cert-manager is already installed and healthy
* `letsencrypt-prod-dns01` is already working
* DNS for `argocd.kakde.eu` is already configured correctly
* the Argo CD CLI is installed where needed

### Open questions

* whether the user wants Argo CD to manage a single application first or a full app-of-apps structure
* whether SSO will be configured later
* whether the initial admin secret should be deleted after password rotation
* whether Argo CD should be further hardened through RBAC, repository credentials, and project restrictions

---

## Next Steps

Now that Argo CD is healthy, the next logical steps are:

1. log into the UI
2. change the admin password
3. connect a Git repository
4. create the first Argo CD `Application`
5. optionally create an app-of-apps bootstrap structure
6. define projects, RBAC, and repo credentials
7. move existing workloads such as notebook or portfolio under GitOps management if desired

A very practical next milestone would be:

* create one simple Git-managed application in Argo CD
* sync it manually once
* verify that Argo CD can reconcile it properly

---

## Glossary

Terms specific to this Argo CD deployment. For standard Kubernetes terms, see the [official glossary](https://kubernetes.io/docs/reference/glossary/).

### Argo CD

A GitOps continuous delivery tool for Kubernetes. It watches a Git repository and reconciles cluster state to match what is declared there.

### Application (Argo CD)

A custom resource that tells Argo CD which Git repo path to watch and which cluster namespace to deploy into.

### ApplicationSet

An Argo CD CRD that generates multiple `Application` objects from a template. Used for managing many apps with a shared pattern.

### `server.insecure`

A configuration flag in `argocd-cmd-params-cm` that disables internal TLS on `argocd-server`. Required in this homelab because Traefik terminates TLS at the edge; double TLS would cause connection failures.

### `--grpc-web`

A flag for the Argo CD CLI that tunnels gRPC over HTTP/1.1. Needed when connecting through a reverse proxy like Traefik that does not natively support HTTP/2 gRPC.

### nodeSelector (`workload: argocd`)

The scheduling rule that pins all Argo CD pods to `wk-2`. This gives Argo CD predictable placement and keeps it off the edge node and the database worker.

---

## Further Learning

These are good official or high-quality places to study the main tools and concepts involved:

* Kubernetes basics: [https://kubernetes.io/docs/tutorials/kubernetes-basics/](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
* Kubernetes Ingress: [https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)
* Argo CD documentation: [https://argo-cd.readthedocs.io/](https://argo-cd.readthedocs.io/)
* Argo CD getting started: [https://argo-cd.readthedocs.io/en/stable/getting_started/](https://argo-cd.readthedocs.io/en/stable/getting_started/)
* Traefik Kubernetes Ingress provider: [https://doc.traefik.io/traefik/providers/kubernetes-ingress/](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)
* cert-manager documentation: [https://cert-manager.io/docs/](https://cert-manager.io/docs/)
* K3s documentation: [https://docs.k3s.io/](https://docs.k3s.io/)

---

## Final State Summary

At the end of this process, the cluster had the following Argo CD setup:

* namespace: `argocd`
* workloads pinned to node: `wk-2`
* public hostname: `argocd.kakde.eu`
* ingress controller: Traefik
* ingress type: standard Kubernetes `Ingress`
* certificate issuer: `letsencrypt-prod-dns01`
* TLS secret: `argocd-kakde-eu-tls`
* `argocd-server` internal TLS: disabled with `server.insecure: "true"`
* health status: verified healthy by the user
