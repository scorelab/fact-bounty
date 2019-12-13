import React, { Component } from 'react'
import AsyncViewWrapper from '../AsyncViewWrapper'
import './style.sass'


class UserInfo extends Component {
  componentDidMount() {

  }


  render() {
    const { loading } = this.props
    return (
        <>
    <p class="user-name-sub">User Profile</p>
      <h1 class="user-full-name"> {this.props.name} </h1>
        <p class="bio"> {this.props.bio} </p>
      </>
    )
  }
}

export default UserInfo
