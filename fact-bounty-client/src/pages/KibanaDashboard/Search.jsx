import React, { Component, Fragment } from 'react'
import {
  KIBANA_DEV_DASHBOARD,
  KIBANA_PROD_DASHBOARD
} from '../../constants/KibanaConstants'
import './style.sass'

class KibanaDashboard extends Component {
  render() {
    return (
      <Fragment>
        <div className="container kibana-dashboard-wrapper">
          <div className="header">
            <h1>Visualizations</h1>
          </div>
          <hr />
          <iframe
            title="Kibana Dashboard"
            src={KIBANA_DEV_DASHBOARD}
            height="1000px"
            width="100%"
          />
        </div>
      </Fragment>
    )
  }
}

KibanaDashboard.propTypes = {}

export default KibanaDashboard
