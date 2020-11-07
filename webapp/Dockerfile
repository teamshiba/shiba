FROM node:15.1.0 AS build

WORKDIR /build/

COPY package.json package-lock.json /build/
RUN npm install

COPY . /build/
RUN npm run build

FROM nginx:1.19.4

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/build /app/

CMD ["nginx", "-g", "daemon off;"]