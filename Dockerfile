FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads generated-audio logs

# Expose ports
EXPOSE 3000 1883

# Start application
CMD ["npm", "run", "start:prod"]

