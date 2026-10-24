# Stage 1: Build the React application
FROM node:24-alpine AS build

# Base URL baked into the bundle. The nginx config in stage 2 proxies /api to
# the engine, so the default works without a build arg.
ARG VITE_ENGINE_API_BASE_URL=/api
ENV VITE_ENGINE_API_BASE_URL=$VITE_ENGINE_API_BASE_URL

WORKDIR /app

# Install exactly what package-lock.json pins
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve the application with an unprivileged Nginx (listens on 8080)
FROM nginxinc/nginx-unprivileged:stable-alpine

# Pick up Alpine security fixes published after the base image was built.
USER root
RUN apk upgrade --no-cache
USER nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=60s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
