import axios from 'axios'

export const setAuthToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = token
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

export const saveAllTokens = tokens => {
  if (
    tokens &&
    tokens.access_token &&
    tokens.refresh_token &&
    tokens.user_details
  ) {
    //Setting the tokens to local storage
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    localStorage.setItem('user_details', JSON.stringify(tokens.user_details))
  }
}

export const saveAcessToken = token => {
  if (token) {
    //Setting the token to local storage
    localStorage.setItem('access_token', token)
  }
}
