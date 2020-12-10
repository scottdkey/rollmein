FROM node:14-slim
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn
COPY . .
CMD yarn start
EXPOSE 5000