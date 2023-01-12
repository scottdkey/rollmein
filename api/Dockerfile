FROM node:18-alpine3.15 as build
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
RUN yarn install
COPY . .
RUN yarn tsc



FROM node:18-alpine3.15 as prod
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .

RUN yarn install --production
COPY --from=build /usr/app/dist ./dist
EXPOSE ${PORT}
CMD ["yarn", "start"]