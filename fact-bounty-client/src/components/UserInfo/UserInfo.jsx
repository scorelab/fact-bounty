import React, { Component } from 'react'
import PropTypes, { string } from 'prop-types'
import AsyncViewWrapper from '../AsyncViewWrapper'
import './style.sass'
import defaultImage from '../../assets/img/placeholder.png'

class UserInfo extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="row">
        <div className="col-2">
          <img
            src={defaultImage}
            alt="profile"
            style={{ width: 100 + '%', borderRadius: 20 }}
          />
        </div>
        <div className="col-10">
          <p className="user-name-sub">User Profile</p>
          <h1 className="user-full-name"> {this.props.name} </h1>
          <p className="bio"> {this.props.bio} </p>
        </div>
      </div>
    )
  }
}

UserInfo.propTypes = {
  name: string,
  bio: string
}

export default UserInfo



