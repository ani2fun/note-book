ARG RUST_VERSION=1.88
ARG ALPINE_VERSION=3.20
ARG MDBOOK_VERSION=0.4.51
ARG ADMONISH_VERSION=1.20.0

FROM rust:${RUST_VERSION}-alpine${ALPINE_VERSION} AS build

RUN apk add --no-cache git openssl-dev musl-dev ca-certificates

RUN cargo install mdbook --version ${MDBOOK_VERSION} --locked
RUN cargo install mdbook-admonish --version ${ADMONISH_VERSION} --locked

WORKDIR /app
COPY . .

RUN mdbook-admonish install . || true
RUN mdbook build


FROM alpine:${ALPINE_VERSION}
RUN apk add --no-cache ca-certificates bash

COPY --from=build /root/.cargo/bin/mdbook /usr/local/bin/
COPY --from=build /root/.cargo/bin/mdbook-admonish /usr/local/bin/
COPY --from=build /app /app

WORKDIR /app
EXPOSE 3000
CMD ["mdbook","serve","-n","0.0.0.0"]
