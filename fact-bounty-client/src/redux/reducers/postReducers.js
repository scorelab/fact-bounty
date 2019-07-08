import {
  APPROVE_VOTE_COMPLETE,
  FAKE_VOTE_COMPLETE,
  FETCH_POSTS,
  INCREMENT_PAGE,
  LOADING,
  MIX_VOTE_COMPLETE,
  NO_MORE,
  VOTE_ERROR,
  LOAD_USER_VOTES,
  USER_VOTE,
  UPDATE_USER_VOTE
} from '../actions/actionTypes'

const initialState = {
  items: [],
  loading: false,
  error: String,
  page: 1,
  userVotes: []
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
    case INCREMENT_PAGE: {
      return {
        ...state,
        page: state.page + 1
      }
    }
    case APPROVE_VOTE_COMPLETE: {
      return {
        ...state,
        loading: false,
        items: state.items.map(post => {
          if (post._id === action.id) {
            post.approved_count = action.approved_count
            post.fake_count = action.fake_count
            post.mixedvote_count = action.mixedvote_count
          }
          return post
        })
      }
    }
    case FAKE_VOTE_COMPLETE: {
      return {
        ...state,
        loading: false,
        items: state.items.map(post => {
          if (post._id === action.id) {
            post.approved_count = action.approved_count
            post.fake_count = action.fake_count
            post.mixedvote_count = action.mixedvote_count
          }
          return post
        })
      }
    }
    case MIX_VOTE_COMPLETE: {
      return {
        ...state,
        loading: false,
        items: state.items.map(post => {
          if (post._id === action.id) {
            post.approved_count = action.approved_count
            post.fake_count = action.fake_count
            post.mixedvote_count = action.mixedvote_count
          }
          return post
        })
      }
    }
    case VOTE_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error
      }
    }
    case LOAD_USER_VOTES:
      return {
        ...state,
        userVotes: action.payload
      }
    case USER_VOTE:
      if (action.payload.voteIndex === -1) {
        return {
          ...state,
          userVotes: [...state.userVotes, action.payload.vote]
        }
      } else {
        return {
          ...state,
          loading: true,
          userVotes: [
            ...state.userVotes.slice(0, action.payload.voteIndex),
            action.payload.vote,
            ...state.userVotes.slice(action.payload.voteIndex + 1)
          ]
        }
      }
    case UPDATE_USER_VOTE:
      return {
        ...state,
        userVotes: state.userVotes.map(item => {
          if (item.story_id === action.postId) {
            return { ...item, _id: action.voteId }
          } else {
            return item
          }
        })
      }
    default: {
      return state
    }
  }
}
