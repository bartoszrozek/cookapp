# Multi-stage Dockerfile for Vite + React (frontend)
# Stage 1: build the static assets
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (copy only package files to leverage layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: serve with nginx
# Stage 2: runtime using node to serve and proxy
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy package.json and install production deps
COPY package.json package-lock.json* ./
RUN npm ci --only=prod --silent

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

EXPOSE 8080

# Start the Node proxy server which serves the SPA and proxies /api
CMD ["node", "server.js"]
