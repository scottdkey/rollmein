FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc


EXPOSE 5000
CMD ["node", "./build/src/server/index.js"]