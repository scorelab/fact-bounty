import { GET_SUCCESS, UPDATE_SUCCESS } from '../actions/actionTypes'

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUCCESS:
      return action.payload

    case UPDATE_SUCCESS:
      return action.payload

    default:
      return state
  }
}
