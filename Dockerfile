FROM node:16-alpine3.14 as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
# RUN yarn migration:run
RUN yarn build api
# RUN yarn seeder:run

FROM node:16-alpine3.14

WORKDIR /app
COPY package.json .
COPY yarn.lock .

RUN yarn --prod

COPY --from=builder /app/dist/api/. .
COPY .env .

ARG PORT
ENV PORT "${PORT}"
EXPOSE "${PORT}"

CMD ["node","main.js"]
