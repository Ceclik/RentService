FROM node:20

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli typescript ts-node

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7000

CMD ["npm", "run", "start:dev"]
