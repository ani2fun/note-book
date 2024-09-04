# Define an argument for the Alpine version, with a default value of 3.18
ARG ALPINE_VERSION=3.18

# Stage 1: Build Stage using Alpine for building the Rust project
FROM alpine:${ALPINE_VERSION} AS build

# Install dependencies: curl for downloading Rust, build-base for compiling, and git
RUN apk add --no-cache curl build-base git openssl-dev musl-dev

# Install Rust using rustup
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# Set the path for Rust (cargo and rustc)
ENV PATH="/root/.cargo/bin:${PATH}"

# Install mdbook via cargo (Rust's package manager)
RUN cargo install mdbook

# Create an app directory for your project
WORKDIR /app

# Copy all the contents of your current project
COPY . .

# Build the book
RUN mdbook build


# Stage 2: Production Stage using Alpine for serving the book
FROM alpine:${ALPINE_VERSION}

# Install minimal runtime dependencies
RUN apk add --no-cache bash ca-certificates

# Copy the built book and mdbook binary from the build stage
COPY --from=build /root/.cargo/bin/mdbook /usr/local/bin/mdbook
COPY --from=build /app /app

# Expose the port that mdbook serve uses (default is 3000)
EXPOSE 3000

# Default command to serve the book, ensuring it binds to 0.0.0.0
WORKDIR /app
CMD ["mdbook", "serve", "-n", "0.0.0.0"]
