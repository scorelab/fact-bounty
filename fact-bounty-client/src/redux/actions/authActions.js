import jwt_decode from 'jwt-decode'
import { setAuthToken, saveAllTokens } from '../../helpers/AuthTokenHelper'
import {
  SET_CURRENT_USER,
  USER_LOADING,
  GET_ERRORS,
  GET_SUCCESS,
  DARK_MODE
} from './actionTypes'
import AuthService from '../../services/AuthService'

//Toggle Dark mode
export const toggleDarkMode=curr=>{
  return{
    type:DARK_MODE,
    payload:!curr
  }
}

// Set logged in user
export const setCurrentUser = payload => {
  return {
    type: SET_CURRENT_USER,
    payload
  }
}

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  }
}

// Login - get user token
export const loginUser = userData => dispatch => {
  AuthService.loginUser(userData)
    .then(res => {
      // Set token to localStorage
      const { access_token, refresh_token, user_details } = res.data
      // Set token to Auth header
      setAuthToken(access_token)
      //Save to localstorage
      saveAllTokens({ access_token, refresh_token, user_details })

      // Decode token to get user data
      const decoded = jwt_decode(access_token)
      // Set current user
      dispatch(
        setCurrentUser({
          id: decoded.identity,
          ...user_details
        })
      )
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
          payload: { message: res.data.message }
        })
      } else {
        history.push('/login')
      }
    }) // re-direct to login on successful register
    .catch(err => {
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

export const OauthUser = creds => dispatch => {
  AuthService.OauthUser(JSON.stringify(creds))
    .then(res => {
      // Set token to localStorage
      const { access_token, refresh_token, user_details } = res.data
      // Set token to Auth header
      setAuthToken(access_token)
      //Save to localstorage
      saveAllTokens({ access_token, refresh_token, user_details })

      // Decode token to get user data
      const decoded = jwt_decode(access_token)
      // Set current user
      dispatch(
        setCurrentUser({
          id: decoded.identity,
          ...user_details
        })
      )
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

// Log user out
export const logoutUser = () => dispatch => {
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser(null))
  //revoke the tokens
  AuthService.revokeRefreshToken()
    .then(() => {
      AuthService.revokeAccessToken()
        .then(() => {
          // Remove tokens from local storage
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_details')
        })
        .catch(err => {
          console.error(err)
        })
    })
    .catch(err => {
      console.error(err)
    })
}

export const forgotPassword = userData => dispatch => {
  AuthService.forgotPassword(userData)
    .then(res => {
      if (res.status === 202) {
        dispatch({
          type: GET_ERRORS,
          payload: { message: res.data.message }
        })
      }
      if (res.status === 200) {
        dispatch({
          type: GET_SUCCESS,
          payload: { message: res.data.message }
        })
      }
    })
    .catch(err => {
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

export const authVerificationToken = (userData, history) => dispatch => {
  AuthService.authVerificationToken(userData)
    .then(res => {
      if (res.status === 202) {
        dispatch({
          type: GET_ERRORS,
          payload: { message: res.data.message }
        })
      }
      if (res.status === 200) {
        history.push('/resetpassword/' + userData.verification_token)
      }
    })
    .catch(err => {
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

export const resetPassword = (userData, history) => dispatch => {
  AuthService.resetPassword(userData)
    .then(res => {
      if (res.status === 202) {
        dispatch({
          type: GET_ERRORS,
          payload: { message: res.data.message }
        })
      }
      if (res.status === 200) {
        dispatch({
          type: GET_SUCCESS,
          payload: { message: res.data.message }
        })
        history.push('/login')
      }
    })
    .catch(err => {
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
