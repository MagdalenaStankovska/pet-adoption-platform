# ============================================================================
# Production Dockerfile for Express backend
# Uses Alpine base image for smaller footprint and security
# Implements security best practices and health checks
# ============================================================================

FROM node:18-alpine

# Install dumb-init to handle signals properly and curl for health checks
RUN apk add --no-cache dumb-init curl

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files from server directory
COPY server/package*.json ./

# Install dependencies with security audit
RUN npm ci --only=production && \
    npm audit fix && \
    npm cache clean --force

# Copy application code (server-specific files)
COPY server/ .

EXPOSE 5000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Health check - verify API is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "start"]
