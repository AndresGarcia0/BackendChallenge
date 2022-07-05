FROM node:18

ENV SKIP_PRELIGHT_CHECK=true

RUN mkdir /app
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci --no-save

RUN export NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000
CMD ["npm", "start"]
