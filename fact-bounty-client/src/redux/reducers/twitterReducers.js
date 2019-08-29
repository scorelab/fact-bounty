import { LOADING_TWEETS, FETCH_TWEETS } from '../actions/actionTypes'

const initialState = {
  loadingTweets: false,
  items: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_TWEETS: {
      return {
        ...state,
        loadingTweets: true
      }
    }
    case FETCH_TWEETS: {
      return {
        ...state,
        items: [...state.items, ...action.payload],
        loadingTweets: false
      }
    }
    default: {
      return state
    }
  }
}
