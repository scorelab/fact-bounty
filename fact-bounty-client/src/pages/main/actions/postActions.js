import axios from "axios";

export const FETCH_POSTS = "FETCH_POSTS";
export const LOADING = "LOADING";
export const APPROVE_VOTE_COMPLETE = "VOTE_COMPLETE";
export const FAKE_VOTE_COMPLETE = "FAKE_VOTE_COMPLETE";
export const MIX_VOTE_COMPLETE = "MIX_VOTE_COMPLETE";
export const VOTE_ERROR = "VOTE_ERROR";
export const INCREMENT_PAGE = "INCREMENT_PAGE";
export const NO_MORE = "NO_MORE";

export const fetchPosts = page => dispatch => {
  dispatch({ type: LOADING });
  fetch("/api/stories/get-range/" + page)
    .then(res => {
      return res.json();
    })
    .then(posts => {
      if (Object.keys(posts.stories).length !== 0) {
        dispatch({
          type: FETCH_POSTS,
          payload: posts.stories
        });
        dispatch({ type: INCREMENT_PAGE });
      }
    })
    .catch(err => {
      console.error("Server response invalid", err);
    });
};

export const approveVote = (voteId, user_id) => dispatch => {
  dispatch({ type: LOADING });
  axios({
    url: "/api/stories/change-upvote-count",
    method: "post",
    data: {
      story_id: voteId,
      change_val: 1,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: APPROVE_VOTE_COMPLETE,
        id: voteId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};

export const fakeVote = (voteId, user_id) => dispatch => {
  dispatch({ type: LOADING });
  axios({
    url: "/api/stories/change-downvote-count",
    method: "post",
    data: {
      story_id: voteId,
      change_val: 1,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: APPROVE_VOTE_COMPLETE,
        id: voteId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};

export const mixVote = (voteId, user_id) => dispatch => {
  dispatch({ type: LOADING });
  axios({
    url: "/api/stories/change-mixedvote-count",
    baseURL: "http://localhost:5000",
    method: "post",
    data: {
      story_id: voteId,
      change_val: 1,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: MIX_VOTE_COMPLETE,
        id: voteId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};
