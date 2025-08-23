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
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Keep nginx running
CMD ["nginx", "-g", "daemon off;"]
