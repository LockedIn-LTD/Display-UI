# Base image: Ubuntu 22.04 LTS for ARM64
# We use arm64v8/ubuntu to explicitly target the ARM64 architecture.
FROM arm64v8/ubuntu:22.04

# Set noninteractive mode for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install development tools (from your original list)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    curl \
    unzip \
    libcurl4-openssl-dev \
    libssl-dev \
    python3 \
    python3-pip \
    gdb \
    vim \
    nano \
    pkg-config \
    # Clean up to reduce image size
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy your project files into the container.
COPY . /app
