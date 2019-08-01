import {
  START_CONTACT_FORM_SUBMIT,
  CONTACT_FORM_SUBMIT_SUCCESS,
  CONTACT_FORM_SUBMIT_FAIL
} from '../actions/actionTypes'

const initialState = {
  loading: false,
  error: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case START_CONTACT_FORM_SUBMIT:
      return {
        ...state,
        loading: true
      }
    case CONTACT_FORM_SUBMIT_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case CONTACT_FORM_SUBMIT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
