import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { loadUserVotes } from '../../redux/actions/postActions'
import PostItem from '../../components/PostItem'
import { getTweetsFromKeyword } from '../../redux/actions/twitterActions'
import { Button } from '@material-ui/core'
import './style.sass'

class TweetSearch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      currentKeyword: '',
      limit: 10
    }
  }

  componentDidMount() {
    this.props.loadUserVotes()
  }

  onSearchPressed = e => {
    e.preventDefault()
    const { keyword } = this.state
    this.props.getTweetsFromKeyword(keyword, this.state.limit)
    this.setState({ currentKeyword: keyword })
  }

  renderPostList = () => {
    const { currentKeyword } = this.state
    const { posts, userVotes } = this.props
    const validPosts = posts ? posts : []

    if (validPosts.length === 0) {
      return (
        <div>
          {currentKeyword === '' ? (
            <h3>Search Twitter by typing any keyword and pressing search!</h3>
          ) : (
            <h3>
              No result found for: <b>{currentKeyword}</b>
            </h3>
          )}
        </div>
      )
    }
    return (
      <div>
        <h3 style={{ marginBottom: 25 }}>
          Showing results for: <b>{currentKeyword}</b>
        </h3>
        {validPosts.map((post, index) => {
          console.log(userVotes)
          const userVote = userVotes.filter(uv => uv.story_id === post._id)
          return (
            <PostItem
              key={index}
              post={post}
              userVote={userVote[0] ? userVote[0].value : null}
            />
          )
        })}
      </div>
    )
  }

  render() {
    const { keyword } = this.state
    const { loadingTweets } = this.props
    return (
      <Fragment>
        <div className="container search-wrapper">
          <div className="header">
            <h1>Tweet Search</h1>
          </div>
          <div className="search-form-container">
            <form onSubmit={this.onSearchPressed}>
              <input
                type="text"
                name="Keyword"
                placeholder="Keyword"
                required
                value={keyword}
                onChange={e => {
                  this.setState({ keyword: e.target.value })
                }}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ width: 120 }}
                type="submit"
                disabled={loadingTweets}
              >
                SEARCH
              </Button>
            </form>
          </div>
          <hr className="hr" />
          {loadingTweets ? <h2>Loading...</h2> : this.renderPostList()}
        </div>
      </Fragment>
    )
  }
}

TweetSearch.propTypes = {
  posts: PropTypes.array,
  loadingTweets: PropTypes.bool,
  userVotes: PropTypes.array,
  getTweetsFromKeyword: PropTypes.func,
  loadUserVotes: PropTypes.func
}

const mapStatetoProps = state => ({
  posts: state.tweets.items.search,
  userVotes: state.posts.userVotes,
  loadingTweets: state.tweets.loadingTweets
})

const mapDispatchToProps = dispatch => ({
  getTweetsFromKeyword: (query, limit) =>
    dispatch(getTweetsFromKeyword(query, limit)),
  loadUserVotes: () => dispatch(loadUserVotes())
})

export default connect(mapStatetoProps, mapDispatchToProps)(TweetSearch)
