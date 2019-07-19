import {
  VOTE_COMPLETE,
  FETCH_POSTS,
  INCREMENT_PAGE,
  LOADING_POSTS,
  FETCH_POST_BY_ID,
  LOADING_USER_VOTES,
  SET_USER_VOTES,
  UPDATE_USER_VOTES,
  UPDATE_POST_VOTES
} from '../actions/actionTypes'

const initialState = {
  items: [], // the posts
  currentPost: null, // the current post in the post detail view
  page: 1,
  userVotes: [],
  loadingPosts: false,
  loadingUserVotes: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_POSTS: {
      return {
        ...state,
        loadingPosts: true
      }
    }
    case FETCH_POSTS: {
      return {
        ...state,
        items: [...state.items, ...action.payload],
        loadingPosts: false
      }
    }
    case FETCH_POST_BY_ID: {
      return {
        ...state,
        currentPost: action.payload,
        loadingPosts: false
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
        ...state
        // items: []
      }
    }
    case LOADING_USER_VOTES: {
      return {
        ...state,
        loadingUserVotes: true
      }
    }
    case SET_USER_VOTES: {
      return {
        ...state,
        userVotes: action.payload,
        loadingUserVotes: false
      }
    }
    case UPDATE_USER_VOTES: {
      return {
        ...state,
        userVotes: [
          ...state.userVotes.filter(
            uv => uv.story_id !== action.payload.story_id
          ),
          action.payload
        ]
      }
    }
    case UPDATE_POST_VOTES: {
      const { story_id, value, userVote } = action.payload
      const updatedItems = state.items.map(item => {
        if (item._id === story_id) {
          let approved_count_diffValue = 0
          let mixedvote_count_diffValue = 0
          let fake_count_diffValue = 0

          if (value === 1) {
            approved_count_diffValue = userVote === 1 ? 0 : 1
            mixedvote_count_diffValue = userVote === 0 ? -1 : 0
            fake_count_diffValue = userVote === -1 ? -1 : 0
          } else if (value === 0) {
            approved_count_diffValue = userVote === 1 ? -1 : 0
            mixedvote_count_diffValue = userVote === 0 ? 0 : 1
            fake_count_diffValue = userVote === -1 ? -1 : 0
          } else if (value === -1) {
            approved_count_diffValue = userVote === 1 ? -1 : 0
            mixedvote_count_diffValue = userVote === 0 ? -1 : 0
            fake_count_diffValue = userVote === -1 ? 0 : 1
          }
          return {
            ...item,
            approved_count: item.approved_count + approved_count_diffValue,
            mixedvote_count: item.mixedvote_count + mixedvote_count_diffValue,
            fake_count: item.fake_count + fake_count_diffValue
          }
        }
        return item
      })
      return {
        ...state,
        items: updatedItems
      }
    }
    default: {
      return state
    }
  }
}
