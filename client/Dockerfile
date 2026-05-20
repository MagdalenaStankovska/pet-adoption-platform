# ============================================================================
# Multi-stage production Dockerfile for React frontend
# Build stage: Compile React application with optimizations
# Runtime stage: Serve via Nginx for better performance and security
# ============================================================================

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build production bundle with optimizations
RUN npm run build

# Stage 2: Runtime (Nginx)
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx config for SPA routing
COPY --from=builder /app/build /usr/share/nginx/html

# Custom nginx configuration to handle React Router
RUN cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 3000;
    server_name _;

    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression for performance
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Cache busting for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing: fallback to index.html for client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

CMD ["nginx", "-g", "daemon off;"]
