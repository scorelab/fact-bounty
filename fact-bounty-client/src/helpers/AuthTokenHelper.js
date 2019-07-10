import axios from 'axios'

const setAuthToken = tokens => {
  if (tokens && tokens.access_token && tokens.refresh_token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common['Authorization'] = tokens.access_token

    //Setting the tokens to local storage
    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken
