import axios from "axios";

export const FETCH_POSTS = "FETCH_POSTS";
export const LOADING = "LOADING";
export const APPROVE_VOTE_COMPLETE = "VOTE_COMPLETE";
export const FAKE_VOTE_COMPLETE = "FAKE_VOTE_COMPLETE";
export const MIX_VOTE_COMPLETE = "MIX_VOTE_COMPLETE";
export const VOTE_ERROR = "VOTE_ERROR";
export const INCREMENT_PAGE = "INCREMENT_PAGE";
export const NO_MORE = "NO_MORE";
export const USER_VOTE = "USER_VOTE";
export const LOAD_USER_VOTES = "LOAD_USER_VOTES";
export const UPDATE_USER_VOTE = "UPDATE_USER_VOTE";

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

export const approveVote = (
  postId,
  user_id,
  voteValue,
  voteIndex,
  voteId,
  voteType,
  prevValue
) => dispatch => {
  const userVotePayload = {
    voteIndex: voteIndex,
    vote: {
      story_id: postId,
      user_id: user_id,
      value: voteValue,
      vote: "approve",
      _id: voteId
    }
  };
  dispatch({ type: USER_VOTE, payload: userVotePayload });
  console.log(
    "story_id > ",
    postId,
    "< change_val > ",
    voteValue,
    "< voteId > ",
    voteId,
    "< prevVote > ",
    voteType,
    "< prevValue > ",
    prevValue
  );
  axios({
    url: "/api/stories/change-upvote-count",
    method: "post",
    data: {
      story_id: postId,
      change_val: voteValue,
      voteId: voteId,
      prevVote: voteType,
      prevValue: prevValue,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: APPROVE_VOTE_COMPLETE,
        id: postId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
      if (voteIndex === -1) {
        dispatch({
          type: UPDATE_USER_VOTE,
          voteId: res.data.voteId,
          postId: postId
        });
      }
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};

export const fakeVote = (
  postId,
  user_id,
  voteValue,
  voteIndex,
  voteId,
  voteType,
  prevValue
) => dispatch => {
  const userVotePayload = {
    voteIndex: voteIndex,
    vote: {
      story_id: postId,
      user_id: user_id,
      value: voteValue,
      vote: "fake",
      _id: voteId
    }
  };
  dispatch({ type: USER_VOTE, payload: userVotePayload });
  console.log(
    "story_id > ",
    postId,
    "< change_val > ",
    voteValue,
    "< voteId > ",
    voteId,
    "< prevVote > ",
    voteType,
    "< prevValue > ",
    prevValue
  );
  axios({
    url: "/api/stories/change-downvote-count",
    method: "post",
    data: {
      story_id: postId,
      change_val: voteValue,
      voteId: voteId,
      prevVote: voteType,
      prevValue: prevValue,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: FAKE_VOTE_COMPLETE,
        id: postId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
      if (voteIndex === -1) {
        dispatch({
          type: UPDATE_USER_VOTE,
          voteId: res.data.voteId,
          postId: postId
        });
      }
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};

export const mixVote = (
  postId,
  user_id,
  voteValue,
  voteIndex,
  voteId,
  voteType,
  prevValue
) => dispatch => {
  const userVotePayload = {
    voteIndex: voteIndex,
    vote: {
      story_id: postId,
      user_id: user_id,
      value: voteValue,
      vote: "mix",
      _id: voteId
    }
  };
  dispatch({ type: USER_VOTE, payload: userVotePayload });
  console.log(
    "story_id > ",
    postId,
    "< change_val > ",
    voteValue,
    "< voteId > ",
    voteId,
    "< prevVote > ",
    voteType,
    "< prevValue > ",
    prevValue
  );
  axios({
    url: "/api/stories/change-mixedvote-count",
    method: "post",
    data: {
      story_id: postId,
      change_val: voteValue,
      voteId: voteId,
      prevVote: voteType,
      prevValue: prevValue,
      user: user_id
    },
    headers: { "Access-Control-Allow-Origin": "*" }
  })
    .then(res => {
      dispatch({
        type: MIX_VOTE_COMPLETE,
        id: postId,
        approved_count: res.data.votes.approved_count,
        fake_count: res.data.votes.fake_count,
        mixedvote_count: res.data.votes.mixedvote_count
      });
      if (voteIndex === -1) {
        dispatch({
          type: UPDATE_USER_VOTE,
          voteId: res.data.voteId,
          postId: postId
        });
      }
    })
    .catch(res => {
      dispatch({
        type: VOTE_ERROR,
        error: res
      });
    });
};

export const loadUserVotes = user_id => dispatch => {
  axios.post("api/stories/load-user-votes", { user: user_id }).then(res => {
    dispatch({
      type: LOAD_USER_VOTES,
      payload: res.data.user_votes
    });
  });
};
