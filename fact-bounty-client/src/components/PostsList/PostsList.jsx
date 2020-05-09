import React, { Component } from 'react'
import { connect } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroller'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import PropTypes from 'prop-types'
import { fetchPosts, loadUserVotes } from '../../redux/actions/postActions'
import PostItem from '../../components/PostItem'
import InputLabel from '@material-ui/core/InputLabel'
import './style.sass'

class PostsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterType: 'all'
    }
  }
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
    return <CircularProgress key={Math.floor(Math.random() * 1000)} />
  }

  renderPostList = () => {
    const { posts, userVotes, limit } = this.props
    const limitedPosts = limit ? posts.slice(0, limit) : posts
    const filteredPosts =
      this.state.filterType === 'all'
        ? limitedPosts
        : this.filterNotesBy(this.state.filterType, limitedPosts)
    return filteredPosts.map((post, index) => {
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

  handleFilter = event => {
    let filterType = event.target.value
    this.setState({ filterType: filterType })
  }

  filterNotesBy = (filterType, posts) => {
    const filteredNotes = posts.filter(post => {
      let desiredCount = post[filterType]
      return (
        Math.max(post.approved_count, post.mixedvote_count, post.fake_count) ===
        desiredCount
      )
    })

    return filteredNotes
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
          <InputLabel htmlFor="filled-age-native-simple">Filter</InputLabel>{' '}
          <br />
          <Select
            native
            value={this.state.filterType}
            onChange={this.handleFilter}
            inputProps={{
              name: 'filter',
              id: 'filter-selector'
            }}
          >
            <option value={'all'}>All</option>
            <option value={'approved_count'}>True</option>
            <option value={'fake_count'}>Fake</option>
            <option value={'mixedvote_count'}>Mixed</option>
          </Select>
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
  loadUserVotes: PropTypes.func,
  filterType: PropTypes.string
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

export default connect(mapStatetoProps, mapDispatchToProps)(PostsList)
