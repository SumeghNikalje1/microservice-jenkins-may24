FROM node:14.21.3-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8080

# Set the default command to start the application
CMD ["npm", "start"]








