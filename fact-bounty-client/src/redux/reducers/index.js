import { combineReducers } from 'redux'
import authReducer from './authReducers'
import errorReducer from './errorReducers'
import postReducer from './postReducers'
import contactUsReducer from './contactUsReducers'
import twitterReducer from './twitterReducers'

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  posts: postReducer,
  contactUs: contactUsReducer,
  tweets: twitterReducer
})
