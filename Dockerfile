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

# Generar Prisma Client en desarrollo
RUN npx prisma generate

# Copiar entrypoint para ejecutar migraciones en dev
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE $PORT

CMD ["/entrypoint.sh"]

# Build Stage
FROM base AS build

ENV CI=true

RUN apk update && apk add --no-cache dumb-init=1.2.5-r3

COPY package.json package-lock.json ./
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm ci --omit=dev && \
    rm -f .npmrc

COPY tsconfig*.json .
COPY .swcrc .
COPY nest-cli.json .
COPY prisma prisma  
COPY src src

# Generar Prisma Client en build
RUN npx prisma generate

# Compilar la aplicación correctamente
RUN npm run build && \
    npm prune --omit=dev

# Production Stage
FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/package.json .
COPY --from=build $DIR/package-lock.json .
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/dist dist

USER $USER
EXPOSE $PORT

CMD ["dumb-init", "node", "dist/main.js"]