FROM node:lts-alpine

WORKDIR /opt/ac-saf-api
COPY . .

RUN npm install
RUN generatePubPrivKeys.sh

EXPOSE 3000
CMD ["node", "server.js"]
