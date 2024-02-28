# ==== CONFIGURE =====
# Use a Node base image
FROM node:alpine 
# Set the working directory to /portal-client inside the container
WORKDIR /portal-server
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# ==== RUN =======
# Set the env to "development"
ENV NODE_ENV development
# Set the db host
ENV DB_HOST db
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 8888
# Start the app
CMD [ "npm", "run", "server" ]