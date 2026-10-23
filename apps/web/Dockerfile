# =============================================================================
# Stage 1: Build (context = repo root)
# =============================================================================
FROM node:22.23.4-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS builder

WORKDIR /build

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
RUN corepack enable && pnpm install --frozen-lockfile --filter @artemis/web

COPY apps/web ./apps/web
RUN pnpm --filter @artemis/web build

# =============================================================================
# Stage 2: Serve with Nginx
# =============================================================================
FROM nginx:1.31.7-alpine@sha256:892bb2152464f0c5d8972593a5f5afaf8054552580b699d95f8ff4af08c2d33d

RUN rm /etc/nginx/conf.d/default.conf

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
