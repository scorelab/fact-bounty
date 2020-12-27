import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer from '../SwipeableDrawer'
import PublicLinks from './Links/PublicLinks'
import PrivateLinks from './Links/PrivateLinks'
import Toast from '../Toast'
import { logoutUser , toggleDarkMode } from '../../redux/actions/authActions'
import styles from './NavBar.style'
import factbountyLogo from '../../assets/logos/factbountyLogo.png'
import './styles.sass'
// import Darkmode from '../Darkmode/DarkMode'

class NavBar extends Component {
  // constructor
  constructor(props) {
    super(props)
    this.state = {
      drawerIsOpen: false,
      toastIsOpen: false
    }
  }

  // toggleDrawer function
  toggleDrawer = drawerIsOpen => () => {
    this.setState({ drawerIsOpen })
  }

  // Show Toast method
  showToast = () => {
    this.setState({ toastIsOpen: true })
  }

  // close Toast method
  closeToast = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({ toastIsOpen: false })
  }

  handleLogout = () => {
    this.showToast()
    this.props.logoutUser()
  }

  render() {
    const { drawerIsOpen, toastIsOpen } = this.state
    const { classes, auth } = this.props
    return (
      <div className={`${classes.root}  ${auth.dark ? 'darkmode nav-bar-container' : 'nav-bar-container'}`}>
        <Toast
          isOpen={toastIsOpen}
          handleClose={this.closeToast}
          message="You logged out!"
        />
        <SwipeableDrawer
          isOpen={drawerIsOpen}
          toggleDrawer={this.toggleDrawer}
        />
        <AppBar position="static" color="default" className={` ${classes.navBar} ${auth.dark ? 'darkmode ' : '' }`}>
          
          <Toolbar>
            
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <div className="logo-container">
              <Link to="/" style={styles.link}>
                <img src={factbountyLogo} alt="logo" />
              </Link>
            </div>
            <div className={classes.linkButtonsContainer}>
              

              {auth.isAuthenticated ? (
                <PrivateLinks handleLogout={this.handleLogout} />
              ) : (
                <PublicLinks />
              )}
              
            </div>
            <span>
              <label className="switch">
                <input
                type="checkbox"
                onChange={() => this.props.toggleDarkMode(auth.dark)}
                />
                <span className ="slider round"></span>
              </label>
            </span>
            {auth.dark ? '☀' : '☾' }
            
          </Toolbar>
          
        </AppBar>
      </div>
    )
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  dark: PropTypes.func.isRequired,
}

const NavBarWithStyles = withStyles(styles)(NavBar)

const mapStateToProps = state => ({
  auth: state.auth,
  dark: state.dark
})

export default connect(
  mapStateToProps,
  { logoutUser , toggleDarkMode }
)(NavBarWithStyles)
