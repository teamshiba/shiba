FROM node:15.1.0 AS build

WORKDIR /build/

COPY package.json package-lock.json /build/
RUN npm install

ARG API_SERVER
ENV REACT_APP_API_SERVER ${API_SERVER}

# Explicitly copy the file so that docker will raise an error if the
# file doesn't exist
COPY .env /build/
COPY . /build/

RUN npm run test-all
RUN npm run build

FROM nginx:1.19.4

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/build /app/

CMD ["nginx", "-g", "daemon off;"]
