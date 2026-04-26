# syntax=docker/dockerfile:1

# ---- Build arguments ----
ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.5.2

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

WORKDIR /app

# ---- Build stage ----
FROM mdbook-tools AS build

COPY . .

# Build & install the local mdbook-d2 preprocessor so `mdbook build` finds it on PATH.
# It POSTs each ```d2 fenced block to kroki.io at build time and inlines the
# returned SVG, so reader browsers never call kroki.
RUN cargo install --path tools/mdbook-d2 --locked \
 && strip /usr/local/cargo/bin/mdbook-d2 || true

RUN mdbook build

# ---- Runtime stage ----
FROM alpine:${ALPINE_VERSION} AS runtime

RUN apk add --no-cache busybox-extras \
 && adduser -D -u 10001 appuser

WORKDIR /site

COPY --from=build --chown=appuser:appuser /app/book /site

USER appuser

EXPOSE 3000

CMD ["httpd", "-f", "-p", "3000", "-h", "/site"]
