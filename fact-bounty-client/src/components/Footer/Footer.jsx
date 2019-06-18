import React, { Component } from 'react'
import factbountyLogoWhite from '../../assets/logos/factbountyLogoWhite.png'
import './style.sass'

class Footer extends Component {
  render() {
    return (
      <div className="footer-container">
        <img src={factbountyLogoWhite} alt="logo" className="logo" />
      </div>
    )
  }
}

export default Footer
