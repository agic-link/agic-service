FROM node:21.2-alpine3.18

COPY . /app
WORKDIR /app
RUN rm -rf Dockerfile
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]