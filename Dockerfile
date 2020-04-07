FROM node:lts-alpine

WORKDIR /opt/ac-saf-api
COPY . .

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]
