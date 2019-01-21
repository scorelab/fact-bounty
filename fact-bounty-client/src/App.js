import React, {Component}                       from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import MuiThemeProvider                         from '@material-ui/core/styles/MuiThemeProvider'
import jwt_decode                               from 'jwt-decode'
import {Provider}                               from 'react-redux'

import setAuthToken                 from './utils/setAuthToken'
import {logoutUser, setCurrentUser} from './actions/authActions'
import store                        from './store'
import theme                        from './theme'
import './App.sass'

import Landing      from './components/landing/Landing'
import Register     from './components/register/Register'
import Login        from './components/login/Login'
import PrivateRoute from './components/private-route/PrivateRoute'
import Dashboard    from './components/dashboard/Dashboard'

// Check for token to keep user logged in
if (localStorage.jwtToken) {
	// Set auth token header auth
	const token = localStorage.jwtToken
	setAuthToken(token)

	// Decode token and get user info and exp
	const decoded = jwt_decode(token)

	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded))

	// Check for expired token
	const currentTime = Date.now() / 1000 // to get in milliseconds
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser())
		// Redirect to login
		window.location.href = './login'
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<MuiThemeProvider theme={theme}>
						<div className="App">
							<Route exact path="/" component={Landing}/>
							<Route exact path="/register" component={Register}/>
							<Route exact path="/login" component={Login}/>
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard}/>
							</Switch>
						</div>
					</MuiThemeProvider>
				</Router>
			</Provider>
		)
	}
}

export default App
