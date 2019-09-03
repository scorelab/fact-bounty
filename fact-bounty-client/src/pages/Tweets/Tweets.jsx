import React, { Component, Fragment } from 'react'
import './style.sass'
import TweetList from '../../components/TweetList'

class Tweets extends Component {
  render() {
    return (
      <Fragment>
        <div className="container post-wrapper">
          <div className="header">
            <h1>Tweets</h1>
          </div>
          <hr className="hr" />
          <TweetList limit={4} user={'adaderana'} />
          <TweetList limit={4} user={'lankacnews'} />
          <TweetList limit={4} user={'vigasapuwath'} />
          <TweetList limit={4} user={'mawbimaonline'} />
        </div>
      </Fragment>
    )
  }
}

Tweets.propTypes = {}

export default Tweets
