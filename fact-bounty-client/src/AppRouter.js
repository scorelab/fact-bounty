import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

//components
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/NavBar'

//pages
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Posts from './pages/Posts'
import Dashboard from './pages/Dashboard'
import TwitterGraph from './pages/TwitterGraph'
import PostDetailView from './pages/PostDetailView'

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <NavBar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route path="/posts" component={Posts} />
          <Route path="/post/:id" component={PostDetailView} />
          <Route exact path="/twitter" component={TwitterGraph} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </Fragment>
      </Router>
    )
  }
}

export default AppRouter
