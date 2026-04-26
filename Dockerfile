# --- Stage 1: Build/Install ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies if needed for build)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .


# RUN npm run build

# --- Stage 2: Production ---

FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

# Copy EVERYTHING from the builder EXCEPT node_modules
# This assumes your source code is in the root of /app in the builder
COPY --from=builder /app /app

# Remove the node_modules that were copied from the builder stage
# because we want to use the fresh ones we just installed above
RUN rm -rf /app/node_modules

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3002
CMD ["node", "index.js"]