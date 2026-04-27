# Note Book

A personal knowledge base built with [mdBook](https://rust-lang.github.io/mdBook/), covering infrastructure, Kubernetes, and Computer Science topics including data structures and algorithms.

Live site: **[https://notebook.kakde.eu](https://notebook.kakde.eu)**

---

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
  - [Installing Rust and Cargo](#installing-rust-and-cargo)
  - [Installing mdBook](#installing-mdbook)
- [Running Locally](#running-locally)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Contributing / AI Agents](#contributing--ai-agents)
- [Official mdBook Documentation](#official-mdbook-documentation)

---

## Introduction

This project is a growing personal collection of technical documentation and notes. It covers:

- **Infrastructure**: Kubernetes (K3s), WireGuard VPN, MetalLB, NGINX Ingress Controller, and more
- **Computer Science**: Data structures, algorithms, system design, and software engineering

All content lives in Markdown files under `src/`. The sidebar is configured in `src/SUMMARY.md`.

---

## Installation

To run this mdBook locally, install **Rust** and **Cargo** first, then install `mdbook`.

### Installing Rust and Cargo

**Linux / macOS:**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustc --version
```

**Windows:**

Download and run the installer from [rustup.rs](https://www.rust-lang.org/tools/install), then verify:

```bash
rustc --version
```

### Installing mdBook

```bash
cargo install mdbook
cargo install mdbook-pagetoc   # right-side per-page table of contents
```

---

## Running Locally

```bash
# Serve with live reload at http://localhost:3000
mdbook serve

# Build static output into book/
mdbook build
```

For interactive remote-language execution during local development, start the bundled local Piston service too:

```bash
docker compose up mdbook piston
```

Then open `http://localhost:3000`. On localhost, Java/C/Go/Kotlin/Scala/Rust playground blocks call `http://localhost:2000/api/v2/execute`.

---

## Docker

The Dockerfile is a three-stage build: Rust/Alpine builds mdBook from source, runs `mdbook build`, then copies the output into a minimal Alpine image served by `busybox httpd`.

```bash
# Build (linux/amd64)
docker buildx build --platform linux/amd64 -t ani2fun/note-book:latest .

# Build (local architecture, e.g. macOS)
docker build -t ani2fun/note-book:latest .

# Run
docker run -p 3000:3000 ani2fun/note-book:latest
```

For the local authoring stack with live reload plus code execution:

```bash
docker compose up mdbook piston
```

---

## CI/CD

Defined in `.github/workflows/build-push-promote.yml`. On every push to `main`:

1. Builds and pushes the Docker image to Docker Hub (`ani2fun/note-book:<sha>` and `:latest`)
2. Checks out the `ani2fun/infra` repository and updates the Kustomize image tag in `deploy/note-book/overlays/prod/kustomization.yaml`
3. Commits and pushes to `infra` — ArgoCD picks it up and deploys to production

Required repository secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `INFRA_REPO_TOKEN`, `INFRA_GIT_USER_NAME`, `INFRA_GIT_USER_EMAIL`.

---

## Contributing / AI Agents

This repository uses two agent guidance files:

- **`CLAUDE.md`** — full authoring spec for Claude Code: lesson structure, writing style, diagram conventions, code comment standards, and DSA-specific patterns. Read this before editing any lesson content.
- **`AGENTS.md`** — guide for Codex and other AI agents: repository layout, build system, CI/CD overview, and a summary of content rules.

---

## Official mdBook Documentation

[https://rust-lang.github.io/mdBook/](https://rust-lang.github.io/mdBook/)
