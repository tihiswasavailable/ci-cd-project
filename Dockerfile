FROM node:16
WORKDIR /app

COPY . .
EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY ..
EXPOSE 3000
CMD ["node", "server.js"]
