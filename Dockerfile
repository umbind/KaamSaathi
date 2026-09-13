# Multi-stage Dockerfile for KaamSaathi API Service
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package descriptors
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/contracts/package.json packages/contracts/
COPY packages/design-tokens/package.json packages/design-tokens/
COPY packages/localization/package.json packages/localization/
COPY services/api/package.json services/api/
COPY apps/admin/package.json apps/admin/
COPY apps/web/package.json apps/web/

# Install dependencies
RUN pnpm install --frozen-lockfile=false

# Copy source trees
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY services/ services/
COPY apps/ apps/

# Build contracts and packages
RUN pnpm --filter @kaamsaathi/contracts build && \
    pnpm --filter @kaamsaathi/design-tokens build && \
    pnpm --filter @kaamsaathi/localization build && \
    pnpm --filter @kaamsaathi/api build

# Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install non-root user for security
USER node

# Copy built distribution from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/package.json ./services/api/package.json

EXPOSE 3000

CMD ["node", "services/api/dist/main.js"]
