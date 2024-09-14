FROM node:alpine AS development

ENV NODE_ENV development

WORKDIR /resume-app

COPY ./package*.json /resume-app

RUN npm install

COPY . .

CMD ["npm","start"]