FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY build .
COPY .env .

EXPOSE 5000
CMD ["nodemon", "src/server/index.js"]