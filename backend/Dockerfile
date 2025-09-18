# Use Alpine Linux for smaller image size
FROM node:18-alpine

# Install LaTeX and dependencies
RUN apk add --no-cache \
    texlive \
    texmf-dist \
    py3-pygments \
    make \
    curl \
    && rm -rf /var/cache/apk/*


# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S latex -u 1001

# Create necessary directories
RUN mkdir -p /app/temp /app/templates /app/uploads && \
    chown -R latex:nodejs /app

# Copy application code
COPY --chown=latex:nodejs . .

# Switch to non-root user
USER latex

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]