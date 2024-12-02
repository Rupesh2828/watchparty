# Use the Node.js 18 image as the base
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Production stage to reduce final image size
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./package.json

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
