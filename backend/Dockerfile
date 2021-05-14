FROM node:12-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY . .

RUN npm run build



FROM node:12-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build /usr/src/app
COPY cert /usr/src/app/cert
COPY uploads /usr/src/app/uploads
COPY package.json /usr/src/app/package.json
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install --only=prod

EXPOSE 3443
CMD ["npm", "start"]
