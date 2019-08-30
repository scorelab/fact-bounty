import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTweets } from '../../redux/actions/twitterActions'
import PropTypes from 'prop-types'
import AsyncViewWrapper from '../AsyncViewWrapper'
import TweetItem from '../TweetItem'

class TweetList extends Component {
  componentDidMount() {
    this.loadTweets()
  }

  loadTweets() {
    const tweets = this.props.tweets[this.props.user]
    if (tweets.length === 0) {
      this.props.fetchTweets(this.props.limit, this.props.user)
    }
  }

  renderTweetList() {
    const tweets = this.props.tweets[this.props.user]
    if (tweets) {
      return tweets.map((item, index) => {
        return <TweetItem key={index} post={item} userVote={null} />
      })
    }
  }

  render() {
    const { loading } = this.props
    return (
      <AsyncViewWrapper loading={loading}>
        {this.renderTweetList()}
      </AsyncViewWrapper>
    )
  }
}

TweetList.propTypes = {
  fetchTweets: PropTypes.func,
  tweets: PropTypes.object,
  loading: PropTypes.bool,
  limit: PropTypes.number,
  user: PropTypes.string
}

const mapStateToProps = state => ({
  tweets: state.tweets.items,
  loading: state.tweets.loadingTweets
})

const mapDispatchToProps = dispatch => ({
  fetchTweets: (limit, url) => dispatch(fetchTweets(limit, url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TweetList)
