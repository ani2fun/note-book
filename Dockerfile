# syntax=docker/dockerfile:1

# ---- Build arguments ----
ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.4.51
ARG ADMONISH_VERSION=1.20.0

# ---- Tooling stage ----
FROM rust:${RUST_VERSION}-alpine${ALPINE_VERSION} AS mdbook-tools

ARG MDBOOK_VERSION
ARG ADMONISH_VERSION

RUN apk add --no-cache \
      git \
      openssl-dev \
      musl-dev \
      ca-certificates \
      binutils

RUN cargo install mdbook --version "${MDBOOK_VERSION}" --locked \
 && cargo install mdbook-admonish --version "${ADMONISH_VERSION}" --locked \
 && strip /usr/local/cargo/bin/mdbook /usr/local/cargo/bin/mdbook-admonish || true

WORKDIR /app

# ---- Build stage ----
FROM mdbook-tools AS build

COPY . .

RUN mdbook-admonish install . || true \
 && mdbook build

# ---- Runtime stage ----
FROM alpine:${ALPINE_VERSION} AS runtime

RUN apk add --no-cache busybox-extras \
 && adduser -D -u 10001 appuser

WORKDIR /site

COPY --from=build --chown=appuser:appuser /app/book /site

USER appuser

EXPOSE 3000

CMD ["httpd", "-f", "-p", "3000", "-h", "/site"]
