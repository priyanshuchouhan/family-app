FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk upgrade --no-cache && \
    npm ci --omit=dev && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm

COPY src ./src

EXPOSE 5000

CMD ["node", "src/app.js"]
