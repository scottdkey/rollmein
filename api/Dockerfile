FROM node:16-alpine3.13 as build

WORKDIR /usr/app
COPY package.json .

RUN yarn

COPY . .

RUN yarn ts

FROM node:16-alpine3.13
WORKDIR /usr/app
COPY package.json .
RUN yarn install --production
COPY --from=build /usr/app/build ./build

EXPOSE 5000

CMD ["yarn", "start"]