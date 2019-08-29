import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTweets } from '../../redux/actions/twitterActions'
import PropTypes from 'prop-types'
import AsyncViewWrapper from '../AsyncViewWrapper'
import PostItem from '../PostItem'

class TweetList extends Component {
  componentDidMount() {
    this.loadTweets()
  }

  loadTweets() {
    this.props.fetchTweets(this.props.limit, this.props.user)
  }

  renderTweetList() {
    const { tweets } = this.props
    return tweets.map((item, index) => {
      return <PostItem key={index} post={item} userVote={null} />
    })
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
  tweets: PropTypes.array,
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
