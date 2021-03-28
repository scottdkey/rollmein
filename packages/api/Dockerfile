FROM node:15.11.0-buster-slim as build

WORKDIR /usr/app
COPY package.json .

RUN yarn

COPY . .

RUN yarn build

FROM node:15.11.0-buster-slim
WORKDIR /usr/app
COPY package.json .
RUN yarn install --production
COPY --from=build /usr/app/build ./build

EXPOSE 5000

CMD ["yarn", "start"]