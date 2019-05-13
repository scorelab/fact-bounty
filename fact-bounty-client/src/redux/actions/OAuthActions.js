import AuthTokenHelper from '../../helpers/AuthTokenHelper'
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER } from '../../redux/actions/actionTypes'
import AuthService from '../../services/AuthService'

export const OauthUser = creds => dispatch => {
  AuthService.OauthUser(JSON.stringify(creds))
    .then(res => {
      const token = res.data.access_token
      localStorage.setItem('jwtToken', token)
      AuthTokenHelper.setAuthToken(token)
      const decoded = jwt_decode(token)
      dispatch({
        type: SET_CURRENT_USER,
        payload: decoded
      })
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
