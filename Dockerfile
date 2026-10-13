FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

COPY . .
RUN pnpm run build

EXPOSE 3001
ENV PORT=3001
ENV NODE_ENV=production
ENV RUN_STANDALONE=true

CMD ["pnpm", "run", "server"]
