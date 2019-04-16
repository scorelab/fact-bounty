import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import PropTypes from "prop-types";

import { fetchPosts, VOTE_ERROR } from "../actions/postActions";
import "../Posts.sass";
import Post from "./Post";
import { loadUserVotes } from "../../../core/userVotes";

class Posts extends Component {
  componentDidMount() {
    if (this.props.isAuth) {
      this.props.loadUserVotes(this.props.user_id);
    }
  }

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
    var a = 0;
    items = this.props.posts.map(post => {
      let voteStatus = { voteType: "", voteValue: -1 };
      for (let i = 0; i < this.props.userVotes.length; i++) {
        const vote = this.props.userVotes[i];
        if (vote.story_id === post._id) {
          voteStatus = { voteType: vote.vote, voteValue: vote.value };
          break;
        }
      }
      return <Post key={a++} post={post} currentVote={voteStatus} />;
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

Posts.propTypes = {
  posts: PropTypes.array,
  nextPage: PropTypes.number,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  fetchPosts: PropTypes.func,
  loadUserVotes: PropTypes.func,
  user_id: PropTypes.string,
  userVotes: PropTypes.array,
  isAuth: PropTypes.bool
};

const mapStatetoProps = state => ({
  posts: state.posts.items,
  nextPage: state.posts.nextPage,
  hasMore: state.posts.hasMore,
  loading: state.posts.loading,
  isAuth: state.auth.isAuthenticated,
  user_id: state.auth.user.sub,
  userVotes: state.auth.userVotes
});

export default connect(
  mapStatetoProps,
  { fetchPosts, loadUserVotes }
)(Posts);
