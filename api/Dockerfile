FROM node:18-alpine3.15 as build
RUN apk update && apk add bash
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn tsc



FROM node:18-alpine3.15
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .

RUN yarn install --production
COPY --from=build /usr/app/dist ./dist
EXPOSE ${PORT}
CMD ["yarn", "start"]