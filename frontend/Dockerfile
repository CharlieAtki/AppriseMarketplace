# Step 1: Use the official Node.js image to build the React app
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (for dependency installation)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app's source code into the container
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Use an Nginx image to serve the built React app
FROM nginx:alpine

# Copy the build files from the previous build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (for the web server)
EXPOSE 80

# Start Nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]
