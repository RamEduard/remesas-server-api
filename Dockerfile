FROM node:12.18.3-slim

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build:prod

EXPOSE 8080

ENTRYPOINT ["npm", "start"]