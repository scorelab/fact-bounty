import React, { Component, Fragment } from 'react'
import './style.sass'
import PostsList from '../../components/PostsList'
import PostItem from '../../components/PostItem'

class Posts extends Component {
  render() {
    return (
      <Fragment>
        <div className="container post-wrapper">
          <div className="header">
            <h1>Posts</h1>
          </div>
          <hr className="hr" />
          <PostsList />
          <PostItem post={testPost} />
        </div>
      </Fragment>
    )
  }
}

Posts.propTypes = {}

export default Posts
