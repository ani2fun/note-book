# GitOps Deployment Guide

> Current note
> This is a detailed historical deep dive. For the current GitOps and app flow, start with [01-platform-overview.md](01-platform-overview.md) and [12-data-and-apps-step-by-step.md](12-data-and-apps-step-by-step.md).
>
> Current repo note: the maintained overlays now live under `k8s-cluster/apps/`, and the Argo CD application manifests live under `k8s-cluster/platform/argocd/applications/`. Treat any later `deploy/...` examples in this document as historical path names.

## Table of contents

1. [Overview](#overview)
2. [GitOps flow and architecture](#what-this-setup-is-trying-to-achieve)
3. [Design decisions](#key-design-decisions-made-in-this-document)
4. [Repository structure](#final-repository-structure)
5. [Step-by-step implementation](#step-by-step-implementation)
6. [Validation and verification](#validation-and-verification)
7. [Troubleshooting](#troubleshooting-guide)
8. [Design trade-offs](#design-trade-offs-and-why-this-approach-was-chosen)
9. [Next steps](#next-steps)
10. [Further learning](#official-and-high-quality-learning-links)

---

## Overview

This document explains how to complete a simple GitOps deployment flow for the `note-book` application using:

* GitHub Actions
* Docker Hub
* an `infra` repository
* Argo CD
* Kubernetes
* Kustomize overlays
* the namespaces `apps-dev` and `apps-prod`
---

## What this setup is trying to achieve

The final system should do this automatically:

1. Code is pushed to the `note-book` repository.
2. GitHub Actions builds a Docker image.
3. GitHub Actions pushes that image to Docker Hub.
4. GitHub Actions updates the image tag inside the `infra` repository.
5. Argo CD watches the `infra` repository and notices that change.
6. Argo CD deploys the new image into Kubernetes automatically.

This is a classic GitOps model.

### what GitOps means

GitOps means Git becomes the **source of truth** for deployment state.

That means:

* application code can live in one repository
* infrastructure and Kubernetes deployment configuration live in another repository
* the cluster should follow what is written in the infrastructure repository
* Argo CD acts like a “Git watcher” for Kubernetes

Instead of a developer running `kubectl apply` manually after every change, the desired state is committed to Git, and Argo CD makes the cluster match Git.

---

## Current architecture and important facts

From the document, these are the agreed current facts.

### Repositories

**Application repository**

* `https://github.com/ani2fun/note-book/`

**Infrastructure repository**

* `https://github.com/ani2fun/infra`

### Cluster and platform facts

* K3s cluster is already running
* Argo CD is already installed and healthy
* Argo CD is exposed with Traefik
* Argo CD is reachable at `argocd.kakde.eu`
* Argo CD workloads are pinned to `wk-2`
* the cluster already uses standard Kubernetes manifests and Kustomize-style layout
* the preferred style is simple and explicit Kubernetes YAML
* the app namespaces are:

    * `apps-dev`
    * `apps-prod`

### Important namespace correction

Earlier in the discussion, `homelab` was used in examples.
That is **no longer correct** for application deployment.

The corrected namespace model is:

* `apps-dev` for development workloads
* `apps-prod` for production workloads

### Infra repository layout already present

The `infra` repo already contains a useful Kustomize-style structure:

```text
deploy/
  note-book/
    base/
    overlays/
      dev/
      prod/
```

This is important because it means the final solution should use the existing structure instead of inventing a new one.

---

## Key design decisions made in this document

Several important decisions were made and refined during the discussion.

### 1. The `infra` repo remains the source of truth

The application repo is only responsible for:

* building the Docker image
* pushing the image
* updating the deployment reference in the `infra` repo

The actual desired deployment state stays in `infra`.

### 2. Argo CD watches the `infra` repo, not the app repo

This is a central GitOps decision.

Why:

* deployments should be controlled from one place
* Argo CD should reconcile against infrastructure definitions
* changes to app code become deployable only after infra is updated

### 3. Keep Kustomize and the existing repo layout

There was no strong reason to move to Helm or a more complex pattern.

The chosen model is:

* `base/` holds shared manifests
* `overlays/dev` customizes development deployment
* `overlays/prod` customizes production deployment

### 4. Do not hardcode namespace in `base`

This was a major correction.

The right pattern is:

* `base` stays reusable
* namespace belongs in overlays
* `overlays/dev` sets `apps-dev`
* `overlays/prod` sets `apps-prod`

### 5. Do not use `sed` to edit full Kubernetes deployment YAML

The original workflow used a `sed` replacement against a deployment file.

That was rejected as the preferred solution because it is brittle.

The safer approach chosen in the document is:

* keep the image tag in `deploy/note-book/overlays/prod/kustomization.yaml`
* update only that one field
* use a YAML-aware update step in GitHub Actions

### 6. Keep the solution simple for a homelab

The discussion explicitly chose to avoid extra moving parts such as:

* Helm, unless needed later
* Argo CD Image Updater
* PR-based promotion flow, for now
* overly fancy templating systems

---

## How the final GitOps flow works

This is the final flow, step by step.

### Step 1: code changes in the `note-book` repo

A developer pushes a commit to the `main` branch of `ani2fun/note-book`.

### Step 2: GitHub Actions builds the Docker image

The workflow builds the Docker image and tags it with:

* the commit SHA, for example `ani2fun/note-book:<sha>`
* `latest`, for convenience

### Step 3: the image is pushed to Docker Hub

Docker Hub becomes the place where the cluster can pull the new image from.

### Step 4: the workflow checks out the `infra` repo

The workflow then clones the infrastructure repository into the runner.

### Step 5: the workflow updates the prod overlay image tag

It updates the image tag in:

```text
deploy/note-book/overlays/prod/kustomization.yaml
```

That file is the clean place to hold the production image version.

### Step 6: the workflow commits the change back to `infra`

This creates a normal Git commit in the infra repo that says, in effect:

> Production should now run this exact image tag.

### Step 7: Argo CD notices the Git change

Because Argo CD watches the production overlay path, it sees that `infra` changed.

### Step 8: Argo CD syncs Kubernetes to match Git

Argo CD applies the updated manifests to the cluster and Kubernetes rolls out the new version in `apps-prod`.

---

## What was wrong with the old workflow

The original workflow was moving in the right direction, but it had multiple issues.

### It built the image twice

It had one job that did a plain `docker build` and then another job that built again and pushed.

That wastes CI time.

### It edited a stale file path

The workflow referenced:

```text
deploy/note-book/notebook-app-deployment.yaml
```

But the actual repo structure now uses:

* `deploy/note-book/base/...`
* `deploy/note-book/overlays/dev/...`
* `deploy/note-book/overlays/prod/...`

So the old path no longer matched the real layout.

### It used `sed` on a full manifest

That is fragile because:

* formatting changes can break it
* multiple image lines can cause accidental replacements
* it is difficult to maintain

### It assumed the wrong namespace model

Earlier examples used `homelab`, but the corrected environment now uses:

* `apps-dev`
* `apps-prod`

### It did not clearly minimize permissions

The improved workflow explicitly limits default permissions and uses a dedicated token for writing to the `infra` repo.

---

## Final repository structure

This is the agreed structure at a high level.

```text
infra/
├── README.md
├── _docs/
├── argocd/
│   └── apps/
│       └── note-book.yaml
└── deploy/
    ├── dummy-app-template/
    └── note-book/
        ├── base/
        └── overlays/
            ├── dev/
            └── prod/
```

The important point is that `deploy/note-book/` already exists and should be kept.

### Why this structure is good

It is easy to understand:

* `base/` = common resources
* `overlays/dev/` = development-specific settings
* `overlays/prod/` = production-specific settings
* `argocd/apps/` = Argo CD application definitions

This is a good balance between organization and simplicity.

---

## Files that matter and what each one does

This section explains the important files without reprinting the `deploy/note-book/` YAML.

### In the `infra` repo

#### `deploy/note-book/base/*`

These files contain the shared Kubernetes resources for the notebook app.

Important rule from the document:

* no hardcoded app namespace in base

#### `deploy/note-book/overlays/dev/kustomization.yaml`

This overlay should set:

* namespace to `apps-dev`
* any dev-specific image or routing settings

#### `deploy/note-book/overlays/prod/kustomization.yaml`

This overlay should set:

* namespace to `apps-prod`
* the production image tag under the `images:` section

This is the file that GitHub Actions updates during promotion.

#### `deploy/note-book/overlays/dev/ingress.yaml`

This should describe how development traffic reaches the dev app, if dev is exposed.

#### `deploy/note-book/overlays/prod/ingress.yaml`

This should describe how production traffic reaches the prod app.

#### `argocd/apps/note-book.yaml`

This file defines the Argo CD `Application` resource.
It tells Argo CD:

* which repo to watch
* which path to watch
* which cluster to deploy to
* which namespace the target app belongs to

### In the `note-book` repo

#### `.github/workflows/build-push-promote.yml`

This workflow:

* builds the app image
* pushes it to Docker Hub
* updates the prod image tag in `infra`
* pushes the infra commit

---

## Prerequisites

Before starting, the operator should have:

### On the local machine

* `git`
* `kubectl`
* access to both repositories
* permission to create or update GitHub secrets
* a valid kubeconfig that can reach the cluster

### In GitHub

The `note-book` repository needs secrets for:

* Docker Hub login
* Git author identity
* pushing to `ani2fun/infra`

### In Kubernetes

The cluster must already have:

* Argo CD installed
* the `argocd` namespace
* Traefik
* cert-manager, if TLS ingress is being used
* namespaces:

    * `apps-dev`
    * `apps-prod`

---

## Step-by-step implementation

## Step 1: confirm the namespaces exist

The first thing is to make sure the application namespaces exist.

Where to run: on any machine that already has `kubectl` access to the cluster.

Command:

```bash
kubectl get ns apps-dev apps-prod
```

What it does:

* checks whether the two namespaces exist

What success looks like:

* both namespaces are listed

If one or both do not exist, create them.

Command:

```bash
kubectl create namespace apps-dev
kubectl create namespace apps-prod
```

What success looks like:

* `namespace/apps-dev created`
* `namespace/apps-prod created`

If they already exist, Kubernetes will return an error saying they already exist. That is fine.

---

## Step 2: confirm the notebook overlay files follow the agreed model

The operator already has the `deploy/note-book/` YAML, so this guide does not print those files again. Instead, it explains what must be true.

### The production overlay must point to `apps-prod`

Where to run: local machine, inside the `infra` repo.

Open the file:

```bash
cd infra
nano deploy/note-book/overlays/prod/kustomization.yaml
```

What to confirm:

* it contains `namespace: apps-prod`
* it has an `images:` section
* the `images:` section includes `ani2fun/note-book`
* the image tag is controlled here

### The development overlay must point to `apps-dev`

Where to run: local machine, inside the `infra` repo.

Command:

```bash
nano deploy/note-book/overlays/dev/kustomization.yaml
```

What to confirm:

* it contains `namespace: apps-dev`

### The base manifests must not hardcode namespace

Where to run: local machine, inside the `infra` repo.

Commands:

```bash
grep -R "namespace:" deploy/note-book/base
```

What it does:

* searches the base folder for hardcoded namespace lines

What success looks like:

* ideally, it returns no app namespace lines for base resources

If base still contains `namespace: homelab` or any app namespace, remove it manually.

---

## Step 3: create or update the Argo CD Application manifest

This file is not under `deploy/note-book/`, so it is safe to include fully.

Where to run: local machine inside the `infra` repo.

Create the folder if needed:

```bash
mkdir -p argocd/apps
```

Create the file:

```bash
cat > argocd/apps/note-book.yaml <<'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: note-book
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/ani2fun/infra.git
    targetRevision: main
    path: deploy/note-book/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: apps-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

What it does:

* creates an Argo CD application definition
* tells Argo CD to watch the production notebook overlay
* tells Argo CD to deploy it into `apps-prod`

What success looks like:

* the file exists
* `cat argocd/apps/note-book.yaml` shows the manifest

### Why this manifest matters

This file is how Argo CD knows:

* where the desired state lives
* what path to render
* where to deploy it

Without this Application object, Argo CD does not know it should track this notebook deployment.

---

## Step 4: render the production overlay locally before applying anything

Rendering is a very important beginner habit.

It means: “show me the final Kubernetes YAML after Kustomize combines base + overlay.”

Where to run: local machine inside the `infra` repo.

Command:

```bash
kubectl kustomize deploy/note-book/overlays/prod
```

What it does:

* renders the final production manifests

What success looks like:

* YAML output is printed
* resources include Deployment, Service, and Ingress
* rendered namespace should be `apps-prod`

A useful verification command:

```bash
kubectl kustomize deploy/note-book/overlays/prod | grep '^  namespace:\|^namespace:'
```

What success looks like:

* the output shows `apps-prod`

If rendering fails, do not continue yet. Fix the overlay first.

---

## Step 5: commit and push the infra repo changes

Where to run: local machine inside the `infra` repo.

Commands:

```bash
git status
git add argocd/apps/note-book.yaml deploy/note-book
git commit -m "feat(note-book): finalize GitOps deployment for apps-prod"
git push origin main
```

What they do:

* show pending changes
* stage the Argo CD app and notebook deployment updates
* create a Git commit
* push it to GitHub

What success looks like:

* commit succeeds
* push succeeds

---

## Step 6: apply the Argo CD Application to the cluster

Even though the app manifest is stored in Git, it still needs to be created in the cluster once.

Where to run: any machine with `kubectl` access and the file available.

Command:

```bash
kubectl apply -n argocd -f argocd/apps/note-book.yaml
```

What it does:

* creates or updates the Argo CD Application resource in the cluster

What success looks like:

* `application.argoproj.io/note-book created`
* or `application.argoproj.io/note-book configured`

Then verify:

```bash
kubectl get application -n argocd note-book
kubectl describe application -n argocd note-book
```

What success looks like:

* the Application exists
* source path is `deploy/note-book/overlays/prod`
* destination namespace is `apps-prod`

---

## Step 7: update the GitHub Actions workflow in the `note-book` repo

This workflow was fully designed in the document and is included here because it is not part of `deploy/note-book/`.

Where to run: local machine.

Clone the repo if needed:

```bash
git clone https://github.com/ani2fun/note-book.git
cd note-book
mkdir -p .github/workflows
```

Create the workflow file:

```bash
cat > .github/workflows/build-push-promote.yml <<'EOF'
name: Build, Push, and Promote Note-Book

on:
  push:
    branches:
      - main
  workflow_dispatch:

concurrency:
  group: note-book-main
  cancel-in-progress: true

permissions:
  contents: read

env:
  IMAGE_REPO: ani2fun/note-book
  INFRA_REPO: ani2fun/infra
  INFRA_KUSTOMIZATION_FILE: deploy/note-book/overlays/prod/kustomization.yaml

jobs:
  build-push-promote:
    name: Build image and update infra repo
    runs-on: ubuntu-latest

    steps:
      - name: Checkout application repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64
          push: true
          tags: |
            ${{ env.IMAGE_REPO }}:${{ github.sha }}
            ${{ env.IMAGE_REPO }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Checkout infra repository
        uses: actions/checkout@v4
        with:
          repository: ${{ env.INFRA_REPO }}
          ref: main
          token: ${{ secrets.INFRA_REPO_TOKEN }}
          path: infra

      - name: Install PyYAML
        run: python3 -m pip install --user pyyaml

      - name: Update production image tag in infra repo
        env:
          IMAGE_TAG: ${{ github.sha }}
          KUSTOMIZATION_PATH: infra/${{ env.INFRA_KUSTOMIZATION_FILE }}
        run: |
          python3 - <<'PY'
          import os
          from pathlib import Path
          import yaml

          path = Path(os.environ["KUSTOMIZATION_PATH"])
          data = yaml.safe_load(path.read_text())

          images = data.setdefault("images", [])
          found = False

          for image in images:
              if image.get("name") == "ani2fun/note-book":
                  image["newName"] = "ani2fun/note-book"
                  image["newTag"] = os.environ["IMAGE_TAG"]
                  found = True
                  break

          if not found:
              images.append({
                  "name": "ani2fun/note-book",
                  "newName": "ani2fun/note-book",
                  "newTag": os.environ["IMAGE_TAG"],
              })

          path.write_text(yaml.safe_dump(data, sort_keys=False))
          PY

      - name: Configure Git identity
        run: |
          git -C infra config user.name "${{ secrets.INFRA_GIT_USER_NAME }}"
          git -C infra config user.email "${{ secrets.INFRA_GIT_USER_EMAIL }}"

      - name: Commit and push infra change
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          git -C infra add "${{ env.INFRA_KUSTOMIZATION_FILE }}"

          if git -C infra diff --cached --quiet; then
            echo "No infra changes to commit."
            exit 0
          fi

          git -C infra commit -m "chore(note-book): promote image to ${IMAGE_TAG}"
          git -C infra pull --rebase origin main
          git -C infra push origin HEAD:main
EOF
```

Commit and push it:

```bash
git add .github/workflows/build-push-promote.yml
git commit -m "ci(note-book): build image and promote prod image tag"
git push origin main
```

### What this workflow does

* builds and pushes the Docker image only once
* updates the production overlay image tag in the infra repo
* commits the promotion to Git
* avoids brittle `sed`
* uses a safer YAML-aware Python update

### Why the Python step was chosen

It updates the `images:` section in a structured way.

That is safer than:

* doing string replacement across a large YAML file
* guessing where the image line is
* depending on layout formatting

---

## Step 8: create the required GitHub secrets

Where to do this: in the GitHub UI for the `ani2fun/note-book` repository, or with GitHub CLI.

Required secrets:

* `DOCKERHUB_USERNAME`
* `DOCKERHUB_TOKEN`
* `INFRA_REPO_TOKEN`
* `INFRA_GIT_USER_NAME`
* `INFRA_GIT_USER_EMAIL`

### What each secret is for

**DOCKERHUB_USERNAME**
The Docker Hub username.

**DOCKERHUB_TOKEN**
A Docker Hub access token used for pushing the image.

**INFRA_REPO_TOKEN**
A GitHub token that can write to `ani2fun/infra`.

**INFRA_GIT_USER_NAME**
The Git author name used by automation.

**INFRA_GIT_USER_EMAIL**
The Git author email used by automation.

### Recommended permissions for `INFRA_REPO_TOKEN`

Use a fine-grained PAT with access only to:

* `ani2fun/infra`

And permissions:

* Contents: Read and write
* Metadata: Read

### Optional GitHub CLI commands

Where to run: local machine with `gh` installed and authenticated.

```bash
gh secret set DOCKERHUB_USERNAME --repo ani2fun/note-book --body "ani2fun"
gh secret set DOCKERHUB_TOKEN --repo ani2fun/note-book --body "<dockerhub-token>"
gh secret set INFRA_REPO_TOKEN --repo ani2fun/note-book --body "<github-token>"
gh secret set INFRA_GIT_USER_NAME --repo ani2fun/note-book --body "ani2fun-bot"
gh secret set INFRA_GIT_USER_EMAIL --repo ani2fun/note-book --body "you@example.com"
```

What success looks like:

* no error output
* the secrets appear in the repository settings

---

## Step 9: trigger the pipeline

There are two easy ways.

### Option 1: push a real code change

Where to run: local machine inside the `note-book` repo.

```bash
git add .
git commit -m "feat: update note-book app"
git push origin main
```

### Option 2: trigger with an empty commit for testing

This is useful when testing the CI/CD pipeline.

Where to run: local machine inside the `note-book` repo.

```bash
git commit --allow-empty -m "chore: trigger notebook GitOps pipeline"
git push origin main
```

What success looks like:

* the workflow starts in GitHub Actions
* the workflow completes successfully

---

## Exact commands to run

This section is a compact runbook version.

### Check namespaces

Run on a machine with cluster access:

```bash
kubectl get ns apps-dev apps-prod
```

If missing:

```bash
kubectl create namespace apps-dev
kubectl create namespace apps-prod
```

### Check that base has no hardcoded namespace

Run inside the `infra` repo:

```bash
grep -R "namespace:" deploy/note-book/base
```

### Open overlay files for review

Run inside the `infra` repo:

```bash
nano deploy/note-book/overlays/dev/kustomization.yaml
nano deploy/note-book/overlays/prod/kustomization.yaml
```

### Create Argo CD app manifest

Run inside the `infra` repo:

```bash
mkdir -p argocd/apps
cat > argocd/apps/note-book.yaml <<'EOF'
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: note-book
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/ani2fun/infra.git
    targetRevision: main
    path: deploy/note-book/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: apps-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF
```

### Render production manifests locally

Run inside the `infra` repo:

```bash
kubectl kustomize deploy/note-book/overlays/prod
kubectl kustomize deploy/note-book/overlays/prod | grep '^  namespace:\|^namespace:'
```

### Commit infra changes

Run inside the `infra` repo:

```bash
git add argocd/apps/note-book.yaml deploy/note-book
git commit -m "feat(note-book): finalize GitOps deployment for apps-prod"
git push origin main
```

### Apply the Argo CD Application

Run on a machine with cluster access:

```bash
kubectl apply -n argocd -f argocd/apps/note-book.yaml
kubectl get application -n argocd note-book
kubectl describe application -n argocd note-book
```

### Create the GitHub Actions workflow

Run inside the `note-book` repo:

```bash
mkdir -p .github/workflows
nano .github/workflows/build-push-promote.yml
```

Paste the workflow content from the earlier section, then save.

### Commit the workflow

Run inside the `note-book` repo:

```bash
git add .github/workflows/build-push-promote.yml
git commit -m "ci(note-book): build image and promote prod image tag"
git push origin main
```

### Trigger the workflow manually by commit

Run inside the `note-book` repo:

```bash
git commit --allow-empty -m "chore: trigger notebook GitOps pipeline"
git push origin main
```

---

## Validation and verification

Validation is extremely important. A beginner should always verify each layer.

## 1. Verify Argo CD knows about the notebook app

Run on a machine with cluster access:

```bash
kubectl get application -n argocd note-book
kubectl describe application -n argocd note-book
```

What success looks like:

* the `note-book` Application exists
* it points to `deploy/note-book/overlays/prod`
* it targets `apps-prod`

## 2. Verify the workflow ran successfully

Where to check: GitHub Actions UI in the `note-book` repo.

What success looks like:

* Docker login step succeeds
* image build step succeeds
* push step succeeds
* checkout of infra repo succeeds
* infra commit and push succeeds

## 3. Verify the infra repo actually changed

Run on a local machine:

```bash
git clone https://github.com/ani2fun/infra.git /tmp/infra-check
cd /tmp/infra-check
git log --oneline -n 5
grep -n "newTag:" deploy/note-book/overlays/prod/kustomization.yaml
```

What success looks like:

* a recent promotion commit exists
* the production overlay now contains the new image tag

## 4. Verify Argo CD synchronized

Run on a machine with cluster access:

```bash
kubectl get application -n argocd note-book
```

What success looks like:

* sync status becomes `Synced`
* health becomes `Healthy`

## 5. Verify notebook is deployed in `apps-prod`

Run on a machine with cluster access:

```bash
kubectl -n apps-prod get deployment,service,ingress
kubectl -n apps-prod get deployment notebook-app-first -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
kubectl -n apps-prod rollout status deployment/notebook-app-first
```

What success looks like:

* the Deployment exists
* the Service exists
* the Ingress exists
* the image is the new SHA tag
* rollout completes successfully

## 6. Verify the app is reachable

Run from a machine that can reach the public hostname:

```bash
curl -I https://notebook.kakde.eu
```

What success looks like:

* an HTTP response comes back
* common successful responses are `200`, `301`, or `302`

## 7. Check for leftovers in old namespaces

Because earlier examples used `homelab`, there may be old resources left somewhere else.

Run on a machine with cluster access:

```bash
kubectl get deployment,service,ingress -A | grep notebook-app-first
```

What success looks like:

* only the intended `apps-prod` deployment is active

If old resources still exist and the new deployment is confirmed healthy, they can be deleted carefully.

Example:

```bash
kubectl delete deployment,service,ingress -n <old-namespace> -l app.kubernetes.io/name=notebook-app-first
```

Be careful to replace `<old-namespace>` correctly.

---

## Troubleshooting guide

## Problem: `apps-dev` or `apps-prod` does not exist

### Symptom

Argo CD or Kubernetes fails because the target namespace is missing.

### Fix

Run:

```bash
kubectl create namespace apps-dev
kubectl create namespace apps-prod
```

---

## Problem: Argo CD Application does not exist

### Symptom

`kubectl get application -n argocd note-book` shows nothing.

### Fix

Apply the manifest again:

```bash
kubectl apply -n argocd -f argocd/apps/note-book.yaml
```

Then verify:

```bash
kubectl get application -n argocd note-book
```

---

## Problem: Argo CD says the app is OutOfSync

### Symptom

The app exists but is not synced.

### Common causes

* a Git change is not yet applied
* the render output is different from live state
* someone changed the live resource manually
* the overlay path is wrong

### Helpful command

```bash
kubectl describe application -n argocd note-book
```

This usually explains the reason.

---

## Problem: Kustomize render fails

### Symptom

This command fails:

```bash
kubectl kustomize deploy/note-book/overlays/prod
```

### Common causes

* invalid YAML
* bad relative path
* namespace problem
* wrong image structure under `images:`

### Fix

Open the overlay file and fix the syntax before continuing.

---

## Problem: GitHub Actions cannot push to `infra`

### Symptom

The workflow fails during the push to `ani2fun/infra`.

### Common causes

* `INFRA_REPO_TOKEN` is missing
* token has wrong permissions
* token does not include the `infra` repository

### Fix

Recreate the token with:

* repository access limited to `ani2fun/infra`
* Contents: Read and write
* Metadata: Read

---

## Problem: Workflow runs, but no change is deployed

### Symptom

The workflow is green, but the cluster still runs the old image.

### Check 1: did the infra repo really change?

```bash
grep -n "newTag:" deploy/note-book/overlays/prod/kustomization.yaml
```

### Check 2: what image is running now?

```bash
kubectl -n apps-prod get deployment notebook-app-first -o jsonpath='{.spec.template.spec.containers[0].image}{"\n"}'
```

### Check 3: what does Argo CD think?

```bash
kubectl describe application -n argocd note-book
```

---

## Problem: Pods are crashing after rollout

### Symptom

The Deployment exists, but pods fail or restart.

### Commands

```bash
kubectl -n apps-prod get pods
kubectl -n apps-prod describe pod <pod-name>
kubectl -n apps-prod logs <pod-name>
```

### Common causes

* bad application startup
* wrong port
* missing environment variables
* readiness probe failure

---

## Problem: Old resources still exist in the previous namespace

### Symptom

The notebook app appears in more than one namespace.

### Check

```bash
kubectl get deployment,service,ingress -A | grep notebook-app-first
```

### Fix

After confirming the new `apps-prod` version is working, delete the old resources carefully:

```bash
kubectl delete deployment,service,ingress -n <old-namespace> -l app.kubernetes.io/name=notebook-app-first
```

---

## Design trade-offs and why this approach was chosen

This section explains not only the final answer, but why it was picked over other options.

## Why keep the infra repo as the source of truth

Because this is the cleanest GitOps model:

* app repo builds artifacts
* infra repo declares deployment state
* Argo CD syncs from infra

That keeps responsibilities clear.

## Why keep Kustomize

Because the repo already uses it well.

Kustomize is a good fit because it allows:

* a reusable base
* environment-specific overlays
* simple image overrides
* direct support from both `kubectl` and Argo CD

## Why not put namespace in base

Because base should stay reusable.

If base hardcodes `apps-prod`, it cannot cleanly be reused for development.

## Why not keep `sed`

Because `sed` works on text, not on YAML structure.

That makes it easier to break the deployment accidentally.

## Why the Python YAML update is a good compromise

It is:

* simple
* explicit
* safer than raw text replacement
* easy to understand for a beginner

## Why not use Argo CD Image Updater

Because it adds extra moving parts, and the chosen workflow already solves the problem well enough for a homelab.

## Why not use Helm

Because there was no strong need.
The existing Kustomize layout already solves the problem in a simpler way.

---

## Contradictions, assumptions, and unresolved gaps

This section is important because the document history had a few evolving decisions.

## Contradictions that were resolved

### `homelab` namespace vs `apps-dev` / `apps-prod`

Earlier examples used `homelab`.
That was corrected later.

Final decision:

* use `apps-dev`
* use `apps-prod`

### Editing a deployment file directly vs overlay-based image update

Earlier logic edited a deployment manifest path directly with `sed`.

Final decision:

* update the production overlay image tag instead

## Assumptions currently being made

* the production notebook deployment still uses the resource name `notebook-app-first`
* the production overlay already contains a valid `images:` block or can be updated to include one
* Argo CD is already able to access the `infra` repo
* the notebook application is expected to be publicly reachable at `notebook.kakde.eu`
* cert-manager and Traefik are already working for other apps

## Unresolved gaps

A few things were not fully specified in the document and should be double-checked by the operator:

* whether the dev overlay should be public or internal-only
* the exact hostname used for dev, if any
* whether old notebook resources still exist in another namespace
* whether the notebook app requires extra secrets or environment variables beyond what was discussed
* whether branch protection should later be added to `infra/main`

---

## Glossary

**Argo CD**
A GitOps controller for Kubernetes. It watches Git and makes the cluster match the desired state.

**GitOps**
A deployment approach where Git stores the desired system state, and automation applies that state.

**Kustomize**
A way to organize Kubernetes configuration using a common base and environment-specific overlays.

**Base**
Shared Kubernetes configuration that should work across multiple environments.

**Overlay**
An environment-specific layer that changes or adds settings on top of the base.

**Namespace**
A way to logically separate workloads inside a Kubernetes cluster.

**Deployment**
A Kubernetes object that manages application pods and rolling updates.

**Ingress**
A Kubernetes object that routes HTTP or HTTPS traffic to services.

**Service**
A Kubernetes object that exposes a stable network endpoint for pods.

**Immutable image tag**
An image tag tied to a unique version, often the Git commit SHA.

**Docker Hub**
A container registry where Docker images are stored and pulled from.

**PAT**
A Personal Access Token, often used to let GitHub Actions authenticate with GitHub.

---

## Next steps

The operator can use this as the clean execution order:

1. Confirm `apps-dev` and `apps-prod` exist.
2. Confirm the notebook Kustomize overlays use those namespaces.
3. Confirm `base` has no hardcoded app namespace.
4. Create or update `argocd/apps/note-book.yaml`.
5. Render the prod overlay locally with `kubectl kustomize`.
6. Commit and push the infra changes.
7. Apply the Argo CD Application manifest.
8. Create or update the GitHub Actions workflow in `note-book`.
9. Add the required GitHub secrets.
10. Trigger the workflow.
11. Verify image push, infra commit, Argo CD sync, and deployment rollout.
12. Clean up any old notebook resources in previous namespaces if needed.

---

## Official and high-quality learning links

Argo CD documentation
[https://argo-cd.readthedocs.io/](https://argo-cd.readthedocs.io/)

Argo CD Application specification
[https://argo-cd.readthedocs.io/en/latest/user-guide/application-specification/](https://argo-cd.readthedocs.io/en/latest/user-guide/application-specification/)

Argo CD declarative setup
[https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/)

Argo CD Kustomize support
[https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/](https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/)

Kubernetes Kustomize documentation
[https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)

GitHub Actions workflow syntax
[https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions)

GitHub secrets in Actions
[https://docs.github.com/actions/security-guides/using-secrets-in-github-actions](https://docs.github.com/actions/security-guides/using-secrets-in-github-actions)

Docker build-push action
[https://github.com/docker/build-push-action](https://github.com/docker/build-push-action)

GitHub fine-grained personal access tokens
[https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

GitHub Actions checkout
[https://github.com/actions/checkout](https://github.com/actions/checkout)
