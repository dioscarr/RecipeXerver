# Use the official Node.js image as the base image
FROM node:14-alpine

# Create a directory for the application
RUN mkdir -p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and yarn.lock files
COPY package*.json yarn.lock ./

# Install the dependencies
RUN yarn

# Copy the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD [ "yarn", "start" ]
