FROM node:23

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .


# Command to run the app
CMD ["node", "app.js"] 