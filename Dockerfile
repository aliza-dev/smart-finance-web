# Base environment setup using a lightweight image
FROM node:18-alpine

# Define the working directory for the application
WORKDIR /smart-finance-app

# Transfer dependency manifests first for better layer caching
COPY package.json package-lock.json* ./

# Execute dependency installation
RUN npm install

# Bring in the rest of the project source code
COPY . .

# Initialize Prisma Client for database interactions
RUN npx prisma generate

# Compile the Next.js project for production deployment
RUN npm run build

# Make port 3000 available to the host network
EXPOSE 3000

# Fire up the application
CMD ["npm", "start"]
