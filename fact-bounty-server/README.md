# Fact-Bounty-server 
[![NPM version](https://travis-ci.org/Anmol%20Bansal/fact-bounty-server.svg?branch=master)](https://travis-ci.org/Anmol%20Bansal/fact-bounty-server)

> 

## Setup

### Pre-requisites
* NodeJS
* MongoDB 

#### MongoDB
For instructions about mongodb setup refer to https://docs.mongodb.com/manual/installation/

Copy `.env.example` to `.env` and specify environment variables.

Copy `config/keys.example.js` to `config/keys.js` and enter database address to it.

```sh
$ npm install
```

## Usage

For production usage - 

```js
$ npm run start
```

For development usage - 

```js
$ npm run dev
```