FROM node:current-alpine3.11 as build
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn tsc



FROM node:current-alpine3.11
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
COPY --from=build /usr/app/dist ./dist
EXPOSE 5000
CMD ["yarn", "start"]