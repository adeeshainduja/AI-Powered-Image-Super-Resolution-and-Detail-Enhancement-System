# Use a lightweight Node image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (this makes future builds super fast)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of your Node backend code
COPY . .

# Expose the port your Express server uses
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]