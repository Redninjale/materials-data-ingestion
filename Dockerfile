FROM node:alpine

WORKDIR /app

COPY . /app/

# Install dependencies and build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Install dependencies for backend
WORKDIR /app/backend
RUN npm install

# Install concurrently to run both frontend and backend
RUN npm install -g concurrently

# Expose the port the application will run on
EXPOSE 8080

# Run both frontend and backend
CMD ["concurrently", "\"npm run start --prefix backend\"", "\"npm run start --prefix frontend\""]

