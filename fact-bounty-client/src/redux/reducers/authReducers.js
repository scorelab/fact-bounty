import {
  SET_CURRENT_USER,
  USER_LOADING,
  DARK_MODE
} from '../actions/actionTypes'

// eslint-disable-next-line prettier/prettier
const isEmpty = require('is-empty')
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  dark: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }
    case USER_LOADING:
      return {
        ...state,
        loading: true
      }
    case DARK_MODE:
      return {
        ...state,
        dark: !state.dark
      }
    default:
      return state
  }
}
