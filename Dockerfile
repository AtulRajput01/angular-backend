# Stage 1: Build the Node.js application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Production build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the previous stage
COPY --from=build /app .

# Expose port 3000 (adjust this to your application's port)
EXPOSE 3000

# Command to run the Node.js application
CMD ["node", "app.js"]
