import { combineReducers } from 'redux'
import authReducer from './authReducers'
import errorReducer from './errorReducers'
import postReducer from '../pages/main/reducers/postReducers';

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	posts: postReducer
})
