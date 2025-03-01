# Step 1: Use the official Node.js image to build the React app
FROM node:lts AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (for dependency installation)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app's source code into the container
COPY . .

# Expose port 3000 for React's dev server (the default port)
EXPOSE 3000

# Start the React development server for hot reloading
CMD ["npm", "start"]
