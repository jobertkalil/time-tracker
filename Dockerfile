# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally (you can skip this if it's already installed globally)
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Build the Angular app for production
RUN ng build

# Use an official Nginx image as the base image
FROM nginx

# Copy nginx configuration to the image
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app to the appropriate location in the container
COPY dist/time-tracker-frontend /usr/share/nginx/html

# Start the Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]