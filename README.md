# Fact Bounty

The recent decade has witnessed the birth of social media ecosystems that brings social organizations, media content and various stakeholders together, and now it appears significant advantages of comprehensiveness, diversity and wisdom that provide users with higher quality of experiences. Meanwhile, social media ecosystems suffer from security, privacy and trustworthiness threats. How to leverage the power of intelligent crowds to improve the ecosystem’s efficacy and efficiency, as well as ensure its security and privacy become burning and challenging issues.

#### Fact Bounty is a crowd sourced fact checking platform.

# User Guide

#### How to Setup

Clone the repository.

`git clone https://github.com/scorelab/fact-Bounty.git`

Change directry to the folder.

`cd fact-Bounty/`

And run npm install in both fact-bounty-client and fact-bounty-server folders.

```
 cd fact-bounty-server/
 npm install
 
 cd ..
 
 cd fact-bounty-client/
 npm install
```

Change the MongoDB url to user local mongodb database url in *fact-Bounty/fact-bounty-server/config/keys-example.js*.

ex:
```
module.exports = {
        mongoURI: "mongodb://localhost:27017/admin",
        secretOrKey: "secret"
}
```
And rename the **keys-example.js** file to **keys.js**

#### How to Use

Start the mongodb server in your local machine

`sudo service mongod start`

Use two terminals, one for fact-bounty-server and the other fot fact-bounty-client.

start the npm server in both directories. use,

`npm start`

And use [localhost:3000](https://) to browse.

> **NOTE**: This version is only supporting for Chrome browser. And make sure to instal the extension -> Redux Dev Tools in chrome extension library.
>

# How to Contribute

- Frist Forke the repository and clone it.
- You can open issue regarding any prolem according to the given issue template
- Make changes and do the PR according to the given template.
