# Base Node.js image
FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build without lint/TS checks
RUN npm run build

# Expose port
EXPOSE 3005

# Start Next.js
CMD ["npm", "start"]
