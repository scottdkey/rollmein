FROM node:20 as build
WORKDIR /usr/app

COPY ./api/package.json .
COPY ./api/yarn.lock .

RUN yarn install

COPY ./api .

COPY ./shared ../shared

RUN yarn build



FROM node:20 as prod
WORKDIR /usr/app

COPY /api/package.json .
COPY /api/yarn.lock .

RUN yarn install --production

COPY --from=build /usr/app/dist ./dist
RUN ls -a
EXPOSE ${PORT}
CMD ["yarn", "start"]