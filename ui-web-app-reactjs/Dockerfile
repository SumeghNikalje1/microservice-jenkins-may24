FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .


EXPOSE 9090

CMD ["npm", "start"]







