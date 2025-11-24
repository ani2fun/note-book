ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.4.51
ARG ADMONISH_VERSION=1.20.0

FROM rust:${RUST_VERSION}-alpine${ALPINE_VERSION} AS build

# re-declare build args in this stage so RUN can see them
ARG MDBOOK_VERSION
ARG ADMONISH_VERSION

RUN apk add --no-cache git openssl-dev musl-dev ca-certificates

RUN cargo install mdbook --version $MDBOOK_VERSION --locked
RUN cargo install mdbook-admonish --version $ADMONISH_VERSION --locked

WORKDIR /app
COPY . .

RUN mdbook-admonish install . || true
RUN mdbook build


FROM alpine:${ALPINE_VERSION}
RUN apk add --no-cache ca-certificates bash

COPY --from=build /usr/local/cargo/bin/mdbook /usr/local/bin/
COPY --from=build /usr/local/cargo/bin/mdbook-admonish /usr/local/bin/
COPY --from=build /app /app

WORKDIR /app
EXPOSE 3000
CMD ["mdbook","serve","-n","0.0.0.0"]

