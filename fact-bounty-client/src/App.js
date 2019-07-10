import React, { Component } from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import jwt_decode from 'jwt-decode'
import { Provider } from 'react-redux'
import AppRouter from './AppRouter'

import setAuthToken from './helpers/AuthTokenHelper'
import { setCurrentUser } from './redux/actions/authActions'
import store from './redux/store'
import theme from './styles/theme'

// Check for token to keep user logged in
if (localStorage.access_token && localStorage.refresh_token) {
  // Set auth token header auth
  setAuthToken({
    access_token: localStorage.access_token,
    refresh_token: localStorage.refresh_token
  })
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.access_token)
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded))
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <AppRouter />
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default App
