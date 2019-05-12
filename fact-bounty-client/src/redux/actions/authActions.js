import setAuthToken from '../../helpers/AuthTokenHelper'
import { SET_CURRENT_USER, USER_LOADING, GET_ERRORS } from './actionTypes'
import AuthService from '../../services/AuthService'
import jwt_decode from 'jwt-decode'

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  }
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem('jwtToken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))
}

// Login - get user token
export const loginUser = userData => dispatch => {
  AuthService.loginUser(userData)
    .then(res => {
      // Set token to localStorage
      const { access_token } = res.data
      localStorage.setItem('jwtToken', access_token)
      // Set token to Auth header
      setAuthToken(access_token)
      // Decode token to get user data
      const decoded = jwt_decode(access_token)
      // Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => {
      let payload = err.response.data
      if (typeof payload === 'string') {
        payload = { fetch: err.response.data }
      }
      return dispatch({
        type: GET_ERRORS,
        payload
      })
    })
}

// Register User
export const registerUser = (userData, history) => dispatch => {
  AuthService.registerUser(userData)
    .then(res => {
      if (res.status === 202) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.message
        })
      } else {
        history.push('/login')
      }
    }) // re-direct to login on successful register
    .catch(err => {
      console.log('res res  res', err)
      if (err && err.response) {
        let payload = err.response.data
        if (typeof payload === 'string') {
          payload = { fetch: err.response.data }
        }
        dispatch({
          type: GET_ERRORS,
          payload
        })
      }
    })
}
