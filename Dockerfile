FROM node:latest
MAINTAINER Simon Groenborg <groenborg27@gmail.com>

WORKDIR /app

COPY package.json bower.json .bowerrc ./

RUN npm install

RUN ./node_modules/bower/bin/bower install --allow-root --config.interactive=false

COPY . .

EXPOSE 3000 27017

CMD ["npm","start"]
