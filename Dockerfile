# Build stage
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies for build)
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install only production dependencies
RUN bun install --production

# Copy built application and server script
COPY --from=build /app/dist ./dist
COPY server.ts ./

# Set production environment
ENV NODE_ENV=production

# Expose port 8500
EXPOSE 8500

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8500/ || exit 1

# Start the Bun production server
CMD ["bun", "run", "serve"]