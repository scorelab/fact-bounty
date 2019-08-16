import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  getPostsFromKeyword,
  loadUserVotes
} from '../../redux/actions/postActions'
import PostItem from '../../components/PostItem'
import { Button } from '@material-ui/core'
import './style.sass'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyword: '',
      currentKeyword: ''
    }
  }

  componentDidMount() {
    this.props.loadUserVotes()
  }

  onSearchPressed = e => {
    e.preventDefault()
    const { keyword } = this.state
    this.props.getPostsFromKeyword(keyword)
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
            <h3>Type a keyword and press search!</h3>
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
    const { loadingPosts } = this.props
    return (
      <Fragment>
        <div className="container search-wrapper">
          <div className="header">
            <h1>Search</h1>
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
                disabled={loadingPosts}
              >
                SEARCH
              </Button>
            </form>
          </div>
          <hr className="hr" />
          {loadingPosts ? <h2>Loading...</h2> : this.renderPostList()}
        </div>
      </Fragment>
    )
  }
}

Search.propTypes = {
  posts: PropTypes.array,
  loadingPosts: PropTypes.bool,
  userVotes: PropTypes.array,
  getPostsFromKeyword: PropTypes.func,
  loadUserVotes: PropTypes.func
}

const mapStatetoProps = state => ({
  posts: state.posts.searchedPosts,
  userVotes: state.posts.userVotes,
  loadingPosts: state.posts.searchedPostsLoading
})

const mapDispatchToProps = dispatch => ({
  getPostsFromKeyword: keyword => dispatch(getPostsFromKeyword(keyword)),
  loadUserVotes: () => dispatch(loadUserVotes())
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Search)
