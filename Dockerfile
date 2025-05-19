FROM node:23.11.1-alpine3.21

COPY . /app
WORKDIR /app
RUN rm -rf Dockerfile
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]