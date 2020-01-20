import { combineReducers } from 'redux'
import authReducer from './authReducers'
import errorReducer from './errorReducers'
import postReducer from './postReducers'
import contactUsReducer from './contactUsReducers'
import twitterReducer from './twitterReducers'
import successReducers from './successReducers'

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  success: successReducers,
  posts: postReducer,
  contactUs: contactUsReducer,
  tweets: twitterReducer
})
