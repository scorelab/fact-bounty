import React, { Component } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types'
import { fetchPosts, loadUserVotes } from '../../redux/actions/postActions'
import PostItem from '../../components/PostItem'
import AsyncViewWrapper from '../../components/AsyncViewWrapper'
import './style.sass'

class PostsList extends Component {
  componentDidMount() {
    this.loadUserVotes()
  }

  loadUserVotes = () => {
    this.props.loadUserVotes()
  }

  loadPosts = () => {
    const { loadingPosts } = this.props
    if (!loadingPosts) {
      this.props.fetchPosts(this.props.page)
    }
  }

  renderLoader = () => {
    return (
      <div className="loader" key={0}>
        <CircularProgress />
      </div>
    )
  }

  renderPostList = () => {
    const { posts, userVotes, limit } = this.props
    const limitedPosts = limit ? posts.slice(0, limit) : posts
    return limitedPosts.map((post, index) => {
      console.log(userVotes)
      const userVote = userVotes.filter(uv => uv.story_id === post._id)
      return (
        <PostItem
          key={index}
          post={post}
          userVote={userVote[0] ? userVote[0].value : null}
        />
      )
    })
  }

  render() {
    const { posts, loadingPosts, limit } = this.props
    return (
      <InfiniteScroll
        pageStart={0}
        hasMore={!limit || (limit && limit >= posts.length)}
        loadMore={this.loadPosts}
        loader={this.renderLoader()}
      >
        <div className="postLayout">
          <div />
          <div>{this.renderPostList()}</div>
          <div />
        </div>
      </InfiniteScroll>
    )
  }
}

PostsList.propTypes = {
  limit: PropTypes.number,
  posts: PropTypes.array,
  loadingPosts: PropTypes.bool,
  page: PropTypes.number,
  userVotes: PropTypes.array,
  loadingUserVotes: PropTypes.bool,
  user: PropTypes.object,
  isAuth: PropTypes.bool,
  fetchPosts: PropTypes.func,
  loadUserVotes: PropTypes.func
}

const mapStatetoProps = state => ({
  posts: state.posts.items,
  page: state.posts.page,
  loadingPosts: state.posts.loadingPosts,
  loadingUserVotes: state.posts.loadingUserVotes,
  userVotes: state.posts.userVotes,
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
  fetchPosts: data => dispatch(fetchPosts(data)),
  loadUserVotes: () => dispatch(loadUserVotes())
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostsList)
