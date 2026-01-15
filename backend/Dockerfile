# ================================
# Stage 1: Build Stage (Multi-stage build)
# ================================
# Use official Node.js LTS version on Alpine Linux (minimal, secure base image)
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy only package files first (for better caching)
# If package.json doesn't change, Docker reuses this layer
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# ================================
# Stage 2: Production Stage
# ================================
FROM node:20-alpine

# Install dumb-init (handles signals properly in containers)
RUN apk add --no-cache dumb-init

# Create a non-root user for security
# Running as root inside containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage (only production dependencies)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create logs directory with proper permissions
RUN mkdir -p /app/logs /app/logs/responses && \
    chown -R nodejs:nodejs /app/logs

# Switch to non-root user
USER nodejs

# Expose the port your backend runs on (default 4000, configurable via BACKEND_PORT)
EXPOSE 4000

# Use dumb-init to handle process signals correctly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
