import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import './style.sass'

//Pages in the dashboard
import Posts from '../Posts'
import PostDetailView from '../PostDetailView'
import TwitterGraph from '../TwitterGraph'
import DashboardSideNav from '../../components/DashboardSideNav'
import Search from '../Search'
import KibanaDashboard from '../KibanaDashboard'

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
              <Route exact path={`/dashboard`} component={Welcome} />
              <Route exact path={`${match.url}/posts`} component={Posts} />
              <Route
                exact
                path={`${match.url}/post/:id`}
                component={PostDetailView}
              />
              <Route
                exact
                path={`${match.url}/twitter`}
                component={TwitterGraph}
              />
              <Route exact path={`${match.url}/search`} component={Search} />
              <Route
                exact
                path={`${match.url}/visualizations`}
                component={KibanaDashboard}
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

const mapStateToProps = state => ({})

export default Dashboard
