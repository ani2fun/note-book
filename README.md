# 📚 My Knowledge Base Collection

Welcome to my personal knowledge base — a collection of guides, notes, and tutorials across a range of technical topics. This includes detailed documentation on setting up infrastructure, Kubernetes clusters, VPNs, and more, as well as key concepts in Computer Science, such as algorithms, system design, and data structures. 🚀

---

🔗 **You can access it here: [https://notebook.kakde.eu](https://notebook.kakde.eu)**

⚠️ Heads up: I’m always tinkering with my homelab, so if the site’s down, there’s a good chance I broke something (again) 🤦‍♂️. Thanks for not losing your cool! 😅

If you'd prefer to explore the content locally, you can follow the instructions below to set it up on your own machine. 🛠️

---

## 📄 Table of Contents

- [📘 Introduction](#-introduction)
- [💻 Installation](#-installation)
    - [⚙️ Installing Rust and Cargo](#-installing-rust-and-cargo)
        - [🐧 On Linux](#-on-linux)
        - [🍏 On macOS](#-on-macos)
        - [🖥️ On Windows](#-on-windows)
    - [📦 Installing mdBook](#-installing-mdbook)
- [📖 Running the Book](#-running-the-book)
- [Building Docker Image](#building-docker-image)
- [📚 Official mdBook Documentation](#-official-mdbook-documentation)

---

## 📘 Introduction

This project serves as my growing personal collection of technical documentation and notes. It covers:

- **Infrastructure Setup**: Topics such as Kubernetes (K3s), WireGuard VPN, MetalLB, NGINX Ingress Controller, and more.
- **Computer Science**: Notes on data structures, algorithms, and software engineering. 🧠

As I continue to explore and work with new technologies, this collection will expand. It's organized for easy navigation, and you can browse the sections in the summary. 📂

---

## 💻 Installation

To run this `mdBook`, you need to install **Rust** and its package manager **Cargo**. Once they are installed, you can install `mdBook`. Below are the step-by-step instructions for different operating systems.

### ⚙️ Installing Rust and Cargo

#### 🐧 On Linux

1. Open a terminal and run the following command:

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

2. Follow the on-screen instructions to complete the installation. 📥
3. After installation, load the environment variables:

    ```bash
    source $HOME/.cargo/env
    ```

4. Verify the installation:

    ```bash
    rustc --version
    ```

#### 🍏 On macOS

1. Open the terminal and run:

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

2. Follow the prompts to complete the installation. 💻
3. Load the environment variables:

    ```bash
    source $HOME/.cargo/env
    ```

4. Verify the installation by checking the Rust version:

    ```bash
    rustc --version
    ```

#### 🖥️ On Windows

1. Download and run the official Rust installer from [rustup.rs](https://www.rust-lang.org/tools/install).
2. Follow the installation instructions. 🛠️
3. After installation, restart your terminal or command prompt.
4. Check the installation by running:

    ```bash
    rustc --version
    ```

For more details, visit the [Rust Installation Guide](https://www.rust-lang.org/tools/install).

---

### 📦 Installing mdBook

Once Rust and Cargo are installed, you can install `mdBook` with the following command:

```bash
cargo install mdbook
```

For more detailed installation instructions, refer to the official mdBook guide: [mdBook Installation](https://rust-lang.github.io/mdBook/guide/installation.html).

---

## 📖 Running the Book

After installing `mdBook`, you can build and serve the book locally.

1. Navigate to the root directory of this project where `book.toml` and the `src/` folder are located.
2. Run the following command to serve the book:

    ```bash
    mdbook serve
    ```

3. Open your web browser and go to `http://localhost:3000` to view the book. 🌐

The server will automatically reload as you make changes to the markdown files. 🔄

## Building Docker Image

1. **For Linux x86_64/amd64:**
```bash
docker build --platform linux/amd64 -t ani2fun/note-book:1.0.0 . 
```

2. **For Mac:**
```bash
docker build -t ani2fun/note-book:1.0.0 . 
```

3. **To Run** 
```bash
docker run -p 3000:3000 ani2fun/note-book:1.0.0 
```

---

## 📚 Official mdBook Documentation

For more information on using `mdBook`, visit the official documentation: [mdBook Documentation](https://rust-lang.github.io/mdBook/).

---