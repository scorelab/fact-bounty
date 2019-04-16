import { SET_CURRENT_USER, USER_LOADING } from "./types";
import { LOAD_USER_VOTES } from "./userVotes";

const isEmpty = require("is-empty");
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  userVotes: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        userVotes: !isEmpty(action.payload) ? [...state.userVotes] : []
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case LOAD_USER_VOTES:
      return {
        ...state,
        userVotes: action.payload
      };
    default:
      return state;
  }
}
