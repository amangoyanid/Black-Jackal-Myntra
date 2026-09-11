# Use Node.js
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build Next.js application
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
