FROM node:26-bookworm-slim

RUN npm install --global pnpm@12.18.0

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .
RUN pnpm build:core

CMD ["node", "dist/apps/core/main.js"]
