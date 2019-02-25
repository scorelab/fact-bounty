import axios from 'axios'
import setAuthToken from '../../../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import { GET_ERRORS, SET_CURRENT_USER } from '../../../core/types'

// Login - get user token
export const loginUser = userData => dispatch => {
	axios
		.post('/api/users/login', userData)
		.then(res => {
			// Save to localStorage

			// Set token to localStorage
			const { token } = res.data
			localStorage.setItem('jwtToken', token)

			// Set token to Auth header
			setAuthToken(token)

			// Decode token to get user data
			const decoded = jwt_decode(token)

			// Set current user
			dispatch({
				type: SET_CURRENT_USER,
				payload: decoded
			})
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}
