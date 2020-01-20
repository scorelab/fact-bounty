import { UPDATE_SUCCESS } from './actionTypes'

export const updateSuccess = payload => dispatch =>
  dispatch({ type: UPDATE_SUCCESS, payload })
