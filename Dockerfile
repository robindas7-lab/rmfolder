FROM ghcr.io/puppeteer/puppeteer:22.9.0

USER root
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "scraper/index.js"]
