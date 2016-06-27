FROM node:latest
MAINTAINER Simon Groenborg <groenborg27@gmail.com>

ENV INSTALL_PATH /usr/src/app
RUN mkdir -p $INSTALL_PATH

WORKDIR INSTALL_PATH

COPY . .

RUN npm install -g bower
RUN npm install 
RUN bower install --allow-root --config.interactive=false 

EXPOSE 3000 27017
CMD ["npm","start"]
