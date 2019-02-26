// @flow

import React, { Component } from "react";
import "../Posts.sass";
import Post from "./Post";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/postActions";
import InfiniteScroll from "react-infinite-scroller";

type Props = {
  nextPage: number,
  loading: boolean,
  hasMore: boolean,
  fetchPosts: (nextPage: number) => {},
  posts: Array<{}>
};

class Posts extends Component<Props> {
  static defaultProps = {};
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
    this.props.posts.map(post => {
      items.push(<Post key={post._id} post={post} />);
    });
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
