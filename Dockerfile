FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY client/package*.json ./client/
RUN npm ci --prefix client

COPY . .

ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

RUN npm run build --prefix client


FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY api ./api

COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3000

USER node

CMD ["node", "api/index.js"]