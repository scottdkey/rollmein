FROM node:18-alpine3.15 as build

WORKDIR /usr/src/react_app
COPY package.json ./

RUN npm install 
COPY . .
RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /usr/src/react_app/build /usr/share/nginx/html/

EXPOSE 443
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]