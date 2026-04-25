FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure database directory exists if needed, though here it's root
EXPOSE 5000

CMD ["node", "server.js"]
