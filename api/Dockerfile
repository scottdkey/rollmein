FROM node:14-slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn --production

COPY build .
COPY .env .

EXPOSE 5000
CMD ["node", "src/server/index.js"]