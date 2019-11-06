FROM node:alpine

MAINTAINER priyesh

COPY . .

RUN npm install

CMD ["npm","start"]
