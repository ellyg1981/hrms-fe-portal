# syntax=docker/dockerfile:1

# ---- build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Use the build-time env settings (e.g. GENERATE_SOURCEMAP=false) from .env
RUN npm run build

# ---- production stage ----
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
