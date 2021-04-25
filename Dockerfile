FROM node:14.16.0-buster-slim
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "app_server.js" ]