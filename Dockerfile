FROM node:22-slim

RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV PATH="/app/node_modules/.bin:$PATH"

COPY . .

RUN mkdir -p /data
RUN chmod +x scripts/setup.sh

EXPOSE 3000

CMD ["./scripts/setup.sh"]
