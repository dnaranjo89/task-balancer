FROM node:20-alpine AS base

# Install dependencies
FROM base AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

# Copy built application
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./
COPY --from=dependencies /app/node_modules ./node_modules

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]