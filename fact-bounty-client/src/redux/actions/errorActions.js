import { UPDATE_ERRORS } from './actionTypes'

export const updateError = payload => dispatch =>
  dispatch({ type: UPDATE_ERRORS, payload })
