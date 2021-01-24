FROM node:14.15.1-alpine3.10 as build

WORKDIR /usr/app
COPY package.json .

RUN yarn

COPY . .

RUN yarn build

FROM node:14-slim
WORKDIR /usr/app
COPY package.json .
RUN yarn install --production
COPY --from=build /usr/app/build .

EXPOSE 5000

CMD "yarn start"