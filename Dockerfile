# Use Ubuntu as the base image
FROM ubuntu:23.10

# Set working directory in the container
WORKDIR /var/www/jw-gis-printout-template-library

# Copy package.json and package-lock.json (if exists) to work directory
COPY ./package*.json /var/www/jw-gis-printout-template-library/

# Copy the rest of the application code
COPY . /var/www/jw-gis-printout-template-library/
# COPY ../GIS-Backend/.npmrc /var/www/jw-gis-printout-template-library/

# Update package lists and install necessary packages
RUN apt-get update && \
    apt-get install -y \
    curl \
    git \
    npm 

# Install NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Source NVM script and install Node.js and npm
SHELL ["/bin/bash", "-c"]
RUN source ~/.nvm/nvm.sh && \
    nvm install v18.13.0 && \
    nvm use v18.13.0 && \
    echo "Node.js version: $(node -v)"


# Set the default shell back to /bin/sh
SHELL ["/bin/bash", "-c"]

# Install dependencies and build the application
RUN npm install canvas \
    npm uninstall bcrypt\
    npm install bcrypt\
    npm run dev

# Expose port 3000
EXPOSE 3000

# Start the Node.js app
CMD ["node", "dist/app.js"]