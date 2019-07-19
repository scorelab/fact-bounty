import {
  VOTE_COMPLETE,
  FETCH_POSTS,
  INCREMENT_PAGE,
  LOADING,
  FETCH_POST_BY_ID
} from '../actions/actionTypes'

const initialState = {
  items: [], // the posts
  currentPost: null, // the current post in the post detail view
  page: 1,
  userVotes: [],
  loading: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        loading: true
      }
    }
    case FETCH_POSTS: {
      return {
        ...state,
        items: [...state.items, ...action.payload],
        loading: false
      }
    }
    case FETCH_POST_BY_ID: {
      return {
        ...state,
        currentPost: action.payload,
        loading: false
      }
    }
    case INCREMENT_PAGE: {
      return {
        ...state,
        page: state.page + 1
      }
    }
    case VOTE_COMPLETE: {
      return {
        ...state,
        loading: false,
        items: []
      }
    }
    default: {
      return state
    }
  }
}
