FROM node:23-alpine AS base

LABEL maintainer="Webank <hello@webank.com>"
LABEL org.opencontainers.image.description="Webank UserApp"


WORKDIR /app

# Mount yarnrc.yml to enable yarn 4
RUN \
  --mount=type=bind,source=.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=yarn.lock,target=/app/yarn.lock \
  --mount=type=bind,source=package.json,target=/app/package.json \
  corepack enable && corepack prepare yarn@4.6.0 --activate

# Install core alpine dependencies (only required ones). Useful for e.g SharpJS.
RUN \
  --mount=type=cache,target=/var/cache/apk,sharing=locked \
  apk add libc6-compat

FROM base AS deps

# Install node dependencies
RUN \
  --mount=type=bind,source=.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=yarn.lock,target=/app/yarn.lock \
  --mount=type=bind,source=package.json,target=/app/package.json \
  --mount=type=cache,target=/app/node_modules \
  --mount=type=cache,target=/app/.yarn \
  yarn install --immutable \
  && cp -R /app/node_modules /app/deps

FROM base AS builder

# Copy all dependencies from `deps` stage
COPY --from=deps /app/deps ./node_modules

# A docker build is always production
ENV NODE_ENV=production

RUN \
  --mount=type=bind,source=./openapi,target=/app/openapi \
  --mount=type=bind,source=./openapi-config.obs.ts,target=/app/openapi-config.obs.ts \
  --mount=type=bind,source=./openapi-config.prf.ts,target=/app/openapi-config.prf.ts \
  --mount=type=bind,source=./public,target=/app/public \
  --mount=type=bind,source=./src,target=/app/src \
  --mount=type=bind,source=./.eslintignore,target=/app/.eslintignore \
  --mount=type=bind,source=./.eslintrc.cjs,target=/app/.eslintrc.cjs \
  --mount=type=bind,source=./.yarnrc.yml,target=/app/.yarnrc.yml \
  --mount=type=bind,source=./package.json,target=/app/package.json \
  --mount=type=bind,source=./postcss.config.js,target=/app/postcss.config.js \
  --mount=type=bind,source=./prettier.config.js,target=/app/prettier.config.js \
  --mount=type=bind,source=./tsconfig.json,target=/app/tsconfig.json \
  --mount=type=bind,source=./tailwind.config.js,target=/app/tailwind.config.js \
  --mount=type=bind,source=./tsconfig.node.json,target=/app/tsconfig.node.json \
  --mount=type=bind,source=./index.html,target=/app/index.html \
  --mount=type=bind,source=./vite.config.ts,target=/app/vite.config.ts \
  --mount=type=bind,source=./yarn.lock,target=/app/yarn.lock \
  --mount=type=cache,target=/app/gen \
  yarn gen:rtk-api \
    && yarn build \
    && cp -R dist /app/final-dist \
    && rm -rf /app/final-dist/*ignored*

FROM nginx:alpine

COPY .docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .docker/nginx/conf.d/ /etc/nginx/conf.d/
COPY .docker/nginx/entrypoint.sh /entrypoint.sh
COPY .docker/nginx/init-scripts/ /docker-entrypoint.d/

COPY --from=builder /app/dist /usr/share/nginx/html