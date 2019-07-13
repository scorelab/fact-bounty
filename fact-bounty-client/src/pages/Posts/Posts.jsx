import React, { Component, Fragment } from 'react'
import './style.sass'
import PostsList from '../../components/PostsList'

class Posts extends Component {
  render() {
    return (
      <Fragment>
        <div className="container post-wrapper">
          <div className="header">
            <h1>Posts</h1>
            <input type="text" name="Search" placeholder="Search" />
          </div>
          <hr className="hr" />
          <PostsList />
        </div>
      </Fragment>
    )
  }
}

Posts.propTypes = {}

export default Posts
