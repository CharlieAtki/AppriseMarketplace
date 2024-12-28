# Use official Node.js image as the base
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the backend will run on
EXPOSE 5000

# Set environment variable for development
ENV NODE_ENV=development

# Start the application with `npm start` or `npm run dev` (depending on your setup)
CMD ["npm", "start"]
