FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk update && \
    apk upgrade && \
    npm ci --omit=dev && \
    npm cache clean --force

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
