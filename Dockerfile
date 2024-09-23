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

# Run both frontend and backend
CMD ["concurrently", "\"npm run start --prefix backend\"", "\"npm run start --prefix frontend\""]

