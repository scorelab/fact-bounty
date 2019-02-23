import axios from 'axios'
import { GET_ERRORS } from '../../../core/types'

// Register User
export const registerUser = (userData, history) => dispatch => {
	axios
		.post('/api/users/register', userData)
		.then(res => history.push('/login')) // re-direct to login on successful register
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		)
}
