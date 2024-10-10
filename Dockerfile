# Step 1: Specify the base image
FROM node:16-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Expose the port on which the app runs
EXPOSE 3000

# Step 7: Command to start the server
CMD ["npm", "start"]
