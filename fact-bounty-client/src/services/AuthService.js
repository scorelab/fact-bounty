import ApiBuilder from '../helpers/ApiBuilder'

/**
 *
 * POST : loginUser
 *
 */
const loginUser = userData => {
  return ApiBuilder.API.post(`/api/users/login`, userData)
}

/**
 *
 * POST : registerUser
 *
 */
const registerUser = userData => {
  return ApiBuilder.API.post(`/api/users/register`, userData)
}

/**
 *
 * POST : OauthUser
 *
 */
const OauthUser = creds => {
  return ApiBuilder.API.post(`/api/users/oauth`, creds)
}

export default {
  loginUser,
  registerUser,
  OauthUser
}
