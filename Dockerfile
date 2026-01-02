# Base stage for shared dependencies
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Development stage
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "start:dev"]

# Build stage for production
FROM base AS build
RUN npm run build
# Remove devDependencies
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production
ENV NODE_ENV=production

# Install PM2 globally
RUN npm install -g pm2

WORKDIR /app

# Copy only the necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/ecosystem.config.js ./ecosystem.config.js

# Create storage directory and set permissions
RUN mkdir -p storage && chmod 777 storage

EXPOSE 3000

# Use pm2-runtime for Docker containers
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
