# Use official Node.js image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD [ "node", "server.js" ]
