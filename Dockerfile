FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm run build

FROM nginx:alpine

ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

ARG PORT=80
ENV NGINX_PORT=${PORT}
ENV NGINX_HOST=localhost

EXPOSE ${PORT}

COPY .docker/app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY .docker/app/nginx/conf.d/ /etc/nginx/conf.d/
COPY .docker/app/entrypoint.sh /entrypoint.sh
COPY .docker/app/nginx/init-scripts/ /docker-entrypoint.d/

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist ./