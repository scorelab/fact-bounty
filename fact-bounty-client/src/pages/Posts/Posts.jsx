import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import PropTypes from 'prop-types'
import { fetchPosts, loadUserVotes } from '../../redux/actions/postActions'
import PostItem from './PostItem'
import './style.sass'

class Posts extends Component {
  componentDidMount() {
    if (this.props.isAuth) {
      this.props.loadUserVotes(this.props.user_id)
    }
  }

  loadItems() {
    if (!this.props.loading) {
      this.props.fetchPosts(this.props.nextPage)
    }
  }

  render() {
    console.log(this.props.userVotes)

    const loader = (
      <div className="loader" key={0}>
        Loading ...
      </div>
    )
    var items = []
    var a = 0

    items = this.props.posts.map(post => {
      let voteStatus = {
        voteType: '',
        voteValue: -1,
        voteIndex: -1,
        voteId: -1
      }

      if (this.props.userVotes) {
        for (let i = 0; i < this.props.userVotes.length; i++) {
          const vote = this.props.userVotes[i]
          if (vote.story_id === post._id) {
            voteStatus = {
              voteType: vote.vote,
              voteValue: vote.value,
              voteIndex: i,
              voteId: vote._id
            }
            break
          }
        }
      }

      return <PostItem key={a++} post={post} currentVote={voteStatus} />
    })

    return (
      <Fragment>
        <h1>Posts</h1>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.props.hasMore}
          loader={loader}
        >
          <div className="postLayout">
            <div />
            <div className="postColumn">{items}</div>
            <div />
          </div>
        </InfiniteScroll>
      </Fragment>
    )
  }
}

Posts.propTypes = {
  posts: PropTypes.array,
  nextPage: PropTypes.number,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  fetchPosts: PropTypes.func,
  loadUserVotes: PropTypes.func,
  user_id: PropTypes.number,
  userVotes: PropTypes.array,
  isAuth: PropTypes.bool
}

const mapStatetoProps = state => ({
  posts: state.posts.items,
  nextPage: state.posts.nextPage,
  hasMore: state.posts.hasMore,
  loading: state.posts.loading,
  isAuth: state.auth.isAuthenticated,
  user_id: state.auth.user.sub,
  userVotes: state.posts.userVotes
})

export default connect(
  mapStatetoProps,
  { fetchPosts, loadUserVotes }
)(Posts)
