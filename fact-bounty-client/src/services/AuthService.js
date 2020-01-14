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
 * POST : forgotPassword
 *
 */
const forgotPassword = userData => {
  return ApiBuilder.API.post(`/api/users/forgot_password`, userData)
}
/**
 *
 * POST : OauthUser
 *
 */
const OauthUser = creds => {
  return ApiBuilder.API.post(`/api/users/oauth`, creds)
}

/**
 *
 * POST : tokenRefresh
 *
 */
const tokenRefresh = () => {
  return ApiBuilder.API.post(`/api/users/token_refresh`, {})
}

/**
 *
 * POST : revokeAccessToken
 *
 */
const revokeAccessToken = () => {
  return ApiBuilder.API.post(`/api/users/logout_access`, {})
}

/**
 *
 * POST : revokeRefreshToken
 *
 */
const revokeRefreshToken = () => {
  return ApiBuilder.API.post(`/api/users/logout_refresh`, {})
}
export default {
  loginUser,
  registerUser,
  forgotPassword,
  OauthUser,
  tokenRefresh,
  revokeAccessToken,
  revokeRefreshToken
}
