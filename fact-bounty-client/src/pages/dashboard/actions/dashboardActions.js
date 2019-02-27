import setAuthToken from '../../../utils/setAuthToken'
import { USER_LOADING, SET_CURRENT_USER } from '../../../core/types'
import { setCurrentUser } from '../../../actions/authActions'

// Log user out
export const logoutUser = () => dispatch => {
	// Remove token from local storage
	localStorage.removeItem('jwtToken')

	// Remove auth header for future requests
	setAuthToken(false)

	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}))
}
