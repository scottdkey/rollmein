FROM node:slim as build
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn typescript



FROM node:slim
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --production
COPY --from=build /usr/app/dist ./dist
EXPOSE 5000
CMD ["yarn", "start"]