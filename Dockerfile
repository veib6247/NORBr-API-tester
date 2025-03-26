FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest

WORKDIR /app

# Copy package files for production dependencies
COPY package.json bun.lockb ./
RUN bun install --production

# Copy built files from builder stage
COPY --from=builder /app/dist /app/dist
# If you have other build outputs, add them here
# COPY --from=builder /app/public /app/public

EXPOSE 3000
CMD ["bun", "run", "start"]