FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY src/ ./src/

RUN apk add tini

RUN npm install
RUN mkdir dist
RUN npm run build
RUN rm -r node_modules src package-lock.json package.json tsconfig.json tsconfig.build.json

ENTRYPOINT ["tini", "-v", "--", "node", "dist/index.js"]