import React, { Component } from 'react'
import { Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import './style.sass'
import PrivateRoute from '../../components/PrivateRoute'

//Pages in the dashboard
import TwitterGraph from '../TwitterGraph'
import DashboardSideNav from '../../components/DashboardSideNav'
import Search from '../Search'
import TweetSearch from '../TweetSearch'
import KibanaDashboard from '../KibanaDashboard'
import PostDetailView from '../../pages/PostDetailView'

class Dashboard extends Component {
  render() {
    const { match } = this.props

    const Welcome = () => (
      <div>
        <h1>
          Welcome to your <b>Dashboard!</b>
        </h1>
      </div>
    )

    return (
      <div className="dashboard-container">
        <hr />
        <div className="row">
          <div className="col-md-2 left-section">
            <DashboardSideNav />
          </div>
          <div className="col-md-10 right-section">
            <Switch>
              <PrivateRoute exact path={`/dashboard`} component={Welcome} />
              <PrivateRoute
                exact
                path={`${match.url}/twitter`}
                component={TwitterGraph}
              />
              <PrivateRoute
                exact
                path={`${match.url}/search`}
                component={Search}
              />
              <PrivateRoute
                exact
                path={`${match.url}/visualizations`}
                component={KibanaDashboard}
              />
              <PrivateRoute
                exact
                path={`${match.url}/post/:id`}
                component={PostDetailView}
              />
              <PrivateRoute
                exact
                path={`${match.url}/tweetsearch`}
                component={TweetSearch}
              />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  match: PropTypes.object
}

export default Dashboard
