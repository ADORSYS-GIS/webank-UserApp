# Use official Node.js image as a base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app for production
RUN npm run build

# Set environment variable for serving the app
ENV NODE_ENV=production

# Expose the port that the app will run on
EXPOSE 5173

# Command to start the app and bind to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
