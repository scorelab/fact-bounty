import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FacebookContainer from './FacebookContainer'
import GoogleContainer from './GoogleContainer'
import './index.scss'

class OAuthContainer extends Component {
  render() {
    return (
      <div className="socialIconsSignup">
        <FacebookContainer button_type={this.props.button_type} />
        <GoogleContainer button_type={this.props.button_type} />
      </div>
    )
  }
}

OAuthContainer.propTypes = {
  button_type: PropTypes.string
}

export default OAuthContainer
