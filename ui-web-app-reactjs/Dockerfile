FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 9090

CMD ["npm", "start"]







