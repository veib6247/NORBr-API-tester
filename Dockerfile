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
COPY --from=builder /app/.output /app/.output

EXPOSE 3000
CMD ["bun", "run", "start"]