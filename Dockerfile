FROM node:current-alpine3.21

WORKDIR /home/node/app
COPY package.json ./
RUN npm i

COPY . .
RUN npm run build

CMD ["node", "build"]
