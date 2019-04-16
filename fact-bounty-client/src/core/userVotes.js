import axios from "axios";

export const LOAD_USER_VOTES = "LOAD_USER_VOTES";

export const loadUserVotes = user_id => dispatch => {
  axios.post("api/stories/load-user-votes", { user: user_id }).then(res => {
    dispatch({
      type: LOAD_USER_VOTES,
      payload: res.data.user_votes
    });
  });
};
