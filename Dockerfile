# Stage 1: Build the React application
FROM node:20-alpine AS build

# Accept VITE_ENGINE_API_BASE_URL as a build argument
ARG VITE_ENGINE_API_BASE_URL
# Set it as an environment variable for the build process
ENV VITE_ENGINE_API_BASE_URL=$VITE_ENGINE_API_BASE_URL

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
