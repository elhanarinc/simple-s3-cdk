# Build stage
FROM node:14.17.3 AS build

COPY . /home/app/

WORKDIR /home/app
RUN npm install

# Package stage
FROM node:14.17.3
COPY --from=build /home/app /usr/local/
CMD ["node", "/usr/local/server.js"]
EXPOSE 3000
