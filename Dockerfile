# Base image with Node.js 20
FROM node:20-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN

# Development Stage
FROM base AS dev

ENV NODE_ENV=development
ENV CI=true

COPY package.json package-lock.json ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm ci  && \
    rm -f .npmrc

COPY tsconfig*.json .
COPY .swcrc .
COPY nest-cli.json .
COPY prisma prisma  
COPY src src

RUN npx prisma generate

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE $PORT

CMD ["/entrypoint.sh"]

# Build Stage
FROM base AS build

ENV CI=true

RUN apk update && apk add --no-cache dumb-init=1.2.5-r3 bash  

COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm ci --omit=dev && \
    rm -f .npmrc

RUN npm install --save @nestjs/cli

COPY tsconfig*.json .
COPY .swcrc .
COPY nest-cli.json .
COPY prisma prisma  
COPY src src

RUN npx prisma generate

RUN npm run build && \
    npm prune --omit=dev

