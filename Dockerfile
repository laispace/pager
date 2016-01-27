FROM node:5.0.0

MAINTAINER laispace "https://github.com/laispace"

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app/

RUN npm run build

RUN npm install -g forever

ENV PORT 80

EXPOSE 80

ENTRYPOINT forever build/server.js
