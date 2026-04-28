# syntax=docker/dockerfile:1

# ---- Build arguments ----
ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.5.2
ARG D2_VERSION=0.7.1

# ---- Tooling stage ----
FROM rust:${RUST_VERSION}-alpine${ALPINE_VERSION} AS mdbook-tools

ARG MDBOOK_VERSION

RUN apk add --no-cache \
      git \
      openssl-dev \
      musl-dev \
      ca-certificates \
      binutils \
      curl

RUN cargo install mdbook --version "${MDBOOK_VERSION}" --locked \
 && strip /usr/local/cargo/bin/mdbook || true

# Per-page right-side TOC preprocessor.
RUN cargo install mdbook-pagetoc --locked \
 && strip /usr/local/cargo/bin/mdbook-pagetoc || true

# Install d2 CLI used by tools/mdbook-d2 to render fenced blocks locally
# at build time. Avoids depending on the public kroki.io HTTP service,
# which has historically returned 504s during burst renders.
ARG D2_VERSION
RUN ARCH="$(uname -m)" \
 && case "$ARCH" in \
      x86_64)  D2_ARCH=amd64 ;; \
      aarch64) D2_ARCH=arm64 ;; \
      *)       echo "Unsupported arch for d2: $ARCH" >&2; exit 1 ;; \
    esac \
 && curl -fsSL "https://github.com/terrastruct/d2/releases/download/v${D2_VERSION}/d2-v${D2_VERSION}-linux-${D2_ARCH}.tar.gz" \
      -o /tmp/d2.tar.gz \
 && mkdir -p /tmp/d2 \
 && tar -xzf /tmp/d2.tar.gz -C /tmp/d2 --strip-components=1 \
 && install -m 0755 /tmp/d2/bin/d2 /usr/local/bin/d2 \
 && rm -rf /tmp/d2 /tmp/d2.tar.gz \
 && d2 --version

WORKDIR /app

# ---- Build stage ----
FROM mdbook-tools AS build

COPY . .

# Build & install the local mdbook-d2 preprocessor so `mdbook build` finds it on PATH.
# It pipes each ```d2 fenced block through the local d2 CLI (installed
# above) and inlines the returned SVG into the rendered HTML.
RUN cargo install --path tools/mdbook-d2 --locked \
 && strip /usr/local/cargo/bin/mdbook-d2 || true

# Cache mdbook-d2's per-block SVG cache across builds. Even with a local
# renderer this avoids re-rendering ~330 unchanged blocks on every image
# rebuild.
RUN --mount=type=cache,target=/app/.mdbook-d2-cache,sharing=locked \
    mdbook build

# ---- Runtime stage ----
FROM alpine:${ALPINE_VERSION} AS runtime

RUN apk add --no-cache busybox-extras \
 && adduser -D -u 10001 appuser

WORKDIR /site

COPY --from=build --chown=appuser:appuser /app/book /site

USER appuser

EXPOSE 3000

CMD ["httpd", "-f", "-p", "3000", "-h", "/site"]
