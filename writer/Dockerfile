FROM node:latest

WORKDIR /app

COPY ./package.json .

RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 8082

CMD [ "npm", "start" ]


