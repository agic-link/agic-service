FROM node:12-alpine

COPY . /app
WORKDIR /app
RUN rm -rf Dockerfile
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]