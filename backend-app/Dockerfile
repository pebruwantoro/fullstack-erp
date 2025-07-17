FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm prune --production

FROM node:20-alpine AS final

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /usr/src/app .

USER appuser

EXPOSE 8080

CMD [ "node", "src/main.js" ]
