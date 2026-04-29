FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm install --build-from-source sqlite3

COPY . .

EXPOSE 5000

CMD ["node","server.js"]