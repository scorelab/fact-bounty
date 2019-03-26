import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";

import setAuthToken from "./utils/setAuthToken";
import { logoutUser, setCurrentUser } from "./actions/authActions";
import store from "./core/store";
import theme from "./core/theme";
import "./App.sass";
import PrivateRoute from "./core/PrivateRoute";
import Landing from "./pages/landing/components/Landing";
import Register from "./pages/register/components/Register";
import Login from "./pages/login/components/Login";
import Dashboard from "./pages/dashboard/components/Dashboard";
import MainLayout from "./pages/main/components/MainLayout";
import TopNavBar from "./shared/components/TopNavBar";
import NotFound from "./pages/notFound/components/404.js";
import About from "./pages/about/About";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <MuiThemeProvider theme={theme}>
            <div className="App">
              <TopNavBar />
              <Switch>
                <Route path="/" exact component={MainLayout} />
                <Route exact path="/about" component={About} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <Route exact path="/landing" component={Landing} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </MuiThemeProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
