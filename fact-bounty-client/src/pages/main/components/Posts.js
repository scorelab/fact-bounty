import React, { Component } from "react";
import "../Posts.sass";
import Post from "./Post";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/postActions";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";

class Posts extends Component {
  loadItems() {
    if (!this.props.loading) {
      this.props.fetchPosts(this.props.nextPage);
    }
  }

  render() {
    const loader = (
      <div className="loader" key={0}>
        Loading ...
      </div>
    );
    var items = [];
    items = this.props.posts.map(post => <Post key={post._id} post={post} />);
    return (
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
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array,
  nextPage: PropTypes.number,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  fetchPosts: PropTypes.func
};

const mapStatetoProps = state => ({
  posts: state.posts.items,
  nextPage: state.posts.nextPage,
  hasMore: state.posts.hasMore,
  loading: state.posts.loading
});

export default connect(
  mapStatetoProps,
  { fetchPosts }
)(Posts);
