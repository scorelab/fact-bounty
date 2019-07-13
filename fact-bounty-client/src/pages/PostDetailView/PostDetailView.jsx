import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import VotesBar from '../../components/VotesBar'
import placeholderWide from '../../assets/img/placeholderWide.png'
import { fetchPostById } from '../../redux/actions/postActions'
import AsyncViewWrapper from '../../components/AsyncViewWrapper'
import './style.sass'

class PostDetailView extends Component {
  componentDidMount() {
    const { fetchPostById, match } = this.props
    fetchPostById(match.params.id)
  }

  render() {
    const { currentPost: post, loading } = this.props
    console.log(post)
    return (
      <AsyncViewWrapper loading={!post || loading}>
        {!post || (
          <div className="container post-detail-view-wrapper">
            <div className="header">
              <div className="left">
                <h2>{post.title}</h2>
                <div className="info">
                  <label>
                    <b>Date:</b> {new Date(post.date).toUTCString()} |
                  </label>
                  <label>
                    <b>Author:</b> {post.author} |
                  </label>
                  <label>
                    <b>Source:</b>
                    <a href={post.source}>{post.source}</a>
                  </label>
                </div>
              </div>
              <div className="right">
                <h5>
                  <b>
                    {post.approved_count +
                      post.mixedvote_count +
                      post.fake_count}
                  </b>{' '}
                  Votes
                </h5>
              </div>
            </div>
            <hr className="hr" />
            <div className="image">
              <img
                src={post.imageLink ? post.imageLink : placeholderWide}
                alt="fact-bounty"
              />
            </div>
            <div className="votes-bar-section">
              <VotesBar
                approved_count={post.approved_count}
                mixedvote_count={post.mixedvote_count}
                fake_count={post.fake_count}
              />
            </div>
            <div className="content">
              <p>{post.content}</p>
            </div>
          </div>
        )}
      </AsyncViewWrapper>
    )
  }
}

PostDetailView.propTypes = {
  match: PropTypes.object,
  currentPost: PropTypes.object || null,
  loading: PropTypes.bool,
  fetchPostById: PropTypes.func
}

const mapStatetoProps = state => ({
  currentPost: state.posts.currentPost,
  loading: state.posts.loading
})

const mapDispatchToProps = dispatch => ({
  fetchPostById: postId => dispatch(fetchPostById(postId))
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(PostDetailView)
