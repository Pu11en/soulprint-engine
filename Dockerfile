FROM node:22-slim AS deps

RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-slim AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends git procps python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

ARG GOG_VERSION=0.11.0
RUN set -eux; \
  apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*; \
  curl -fsSL "https://github.com/steipete/gogcli/releases/download/v${GOG_VERSION}/gogcli_${GOG_VERSION}_linux_amd64.tar.gz" -o /tmp/gog.tar.gz; \
  tar -xzf /tmp/gog.tar.gz -C /tmp/; \
  mv /tmp/gog /usr/local/bin/gog; \
  chmod +x /usr/local/bin/gog; \
  rm -f /tmp/gog.tar.gz; \
  apt-get purge -y --auto-remove curl

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json package-lock.json ./
COPY . .

ENV PATH="/app/node_modules/.bin:$PATH"

RUN mkdir -p /data
RUN chmod +x scripts/setup.sh
RUN cp scripts/systemctl /usr/local/bin/systemctl && chmod +x /usr/local/bin/systemctl

EXPOSE 3000

CMD ["./scripts/setup.sh"]
