# =============================================================================
# Stage 1: Build (context = repo root)
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /build

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
RUN corepack enable && pnpm install --frozen-lockfile --filter @artemis/web

COPY apps/web ./apps/web
RUN pnpm --filter @artemis/web build

# =============================================================================
# Stage 2: Serve with Nginx
# =============================================================================
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
