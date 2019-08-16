import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getPostsFromKeyword } from '../../redux/actions/postActions'
import './style.sass'

class Search extends Component {

  componentDidMount() {
    this.props.getPostsFromKeyword('attack')
  }

  render() {
    return (
      <Fragment>
        <div className="container search-wrapper">
          <div className="header">
            <h1>Search</h1>
          </div>
          <hr className="hr" />
        </div>
      </Fragment>
    )
  }
}

Search.propTypes = {}

const mapStatetoProps = state => ({
  searchedPosts: state.posts.searchedPosts
})

const mapDispatchToProps = dispatch => ({
  getPostsFromKeyword: keyword => dispatch(getPostsFromKeyword(keyword)),
})

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Search)
