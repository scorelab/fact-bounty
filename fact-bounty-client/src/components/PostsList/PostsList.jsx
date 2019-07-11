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
    // if (this.props.isAuth) {
    //   this.props.loadUserVotes(this.props.user_id)
    // }
  }

  loadPosts = () => {
    if (!this.props.loadingPosts) {
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
    const { posts, limit } = this.props
    const limitedPosts = limit ? posts.slice(0, limit) : posts

    return limitedPosts.map((post, index) => {
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
      return <PostItem key={index} post={post} currentVote={voteStatus} />
    })
  }

  render() {
    const { posts, loadingPosts, limit } = this.props
    return (
      <AsyncViewWrapper loading={posts.length <= 0 && loadingPosts}>
        <div className="post-list-wrapper">
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
        </div>
      </AsyncViewWrapper>
    )
  }
}

PostsList.propTypes = {
  limit: PropTypes.number,
  posts: PropTypes.array,
  page: PropTypes.number,
  loadingPosts: PropTypes.bool,
  userVotes: PropTypes.array,
  user: PropTypes.object,
  isAuth: PropTypes.bool,
  fetchPosts: PropTypes.func,
  loadUserVotes: PropTypes.func
}

const mapStatetoProps = state => ({
  posts: state.posts.items,
  page: state.posts.page,
  loadingPosts: state.posts.loading,
  userVotes: state.posts.userVotes,
  isAuth: state.auth.isAuthenticated,
  user: state.auth.user
})

const mapDispatchToProps = dispatch => ({
  fetchPosts: data => dispatch(fetchPosts(data)),
  loadUserVotes: data => dispatch(loadUserVotes(data))
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostsList)
