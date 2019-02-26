FROM node:8

RUN mkdir -p /usr/fact-bounty/fact-bounty-client
WORKDIR /usr/fact-bounty/fact-bounty-client

ENV PATH /usr/app/node_modules/.bin:$PATH


COPY package.json /usr/fact-bounty/fact-bounty-client
RUN npm install --silent
COPY . /usr/fact-bounty/fact-bounty-client

EXPOSE 3000
CMD ["npm", "start"]