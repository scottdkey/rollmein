FROM node:18-alpine3.15 as build
WORKDIR /usr/app

COPY ./api/package.json .
COPY ./api/yarn.lock .

WORKDIR /usr/app
RUN yarn install
COPY ./api .

ADD shared ../shared

RUN yarn build



FROM node:18-alpine3.15 as prod
WORKDIR /usr/app

COPY /api/package.json .
COPY /api/yarn.lock .

RUN yarn install --production

COPY --from=build /usr/app/dist ./dist
EXPOSE ${PORT}
CMD ["yarn", "start"]