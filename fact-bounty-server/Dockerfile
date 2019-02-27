FROM node

RUN mkdir -p /usr/fact-bounty/fact-bounty-server
WORKDIR /usr/fact-bounty/fact-bounty-server

COPY package.json /usr/fact-bounty/fact-bounty-server
RUN npm install
COPY . /usr/fact-bounty/fact-bounty-server
EXPOSE 7000
CMD ["npm", "start"]