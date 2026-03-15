# syntax=docker/dockerfile:1

# ---- Build arguments ----
ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.4.51
ARG ADMONISH_VERSION=1.20.0

# ---- Build stage ----
FROM rust:${RUST_VERSION}-alpine${ALPINE_VERSION} AS build

# Make version args visible in this stage
ARG MDBOOK_VERSION
ARG ADMONISH_VERSION

# Build-time dependencies
RUN apk add --no-cache \
      git \
      openssl-dev \
      musl-dev \
      ca-certificates \
      binutils

WORKDIR /app

# Copy the whole project so mdBook sees ALL sources (src, static, theme, etc.)
COPY . .

# Optional cleanup to keep what we copy later smaller (no-op if dirs don’t exist)
RUN rm -rf .git target node_modules

# Install mdBook + mdbook-admonish with pinned versions, then strip binaries
RUN cargo install mdbook --version "${MDBOOK_VERSION}" --locked \
 && cargo install mdbook-admonish --version "${ADMONISH_VERSION}" --locked \
 && strip /usr/local/cargo/bin/mdbook /usr/local/cargo/bin/mdbook-admonish || true

# Install admonish assets and ensure the book builds
RUN mdbook-admonish install . || true \
 && mdbook build

# ---- Runtime stage ----
FROM alpine:${ALPINE_VERSION}

# Minimal runtime deps
RUN apk add --no-cache \
      ca-certificates \
      bash

WORKDIR /app

# Copy only the compiled tools from the build stage
COPY --from=build /usr/local/cargo/bin/mdbook /usr/local/bin/
COPY --from=build /usr/local/cargo/bin/mdbook-admonish /usr/local/bin/

# Copy the book sources and any static/theme files from the build stage
# (we copy /app as a whole so we don't miss static dirs referenced in book.toml)
COPY --from=build /app /app

EXPOSE 3000

# mdBook defaults to 3000; -n 0.0.0.0 makes it reachable from outside
CMD ["mdbook", "serve", "-n", "0.0.0.0"]
