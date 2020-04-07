FROM node:lts-alpine

WORKDIR /opt/aethix-official-api
COPY . .

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]
