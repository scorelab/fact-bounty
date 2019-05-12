import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SwipeableDrawer from '../SwipeableDrawer'
import PublicLinks from './Links/PrivateLinks'
import PrivateLinks from './Links/PrivateLinks'
import Toast from '../Toast'
import { logoutUser } from '../../redux/actions/authActions'
import styles from './NavBar.style'

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
      <div className={classes.root}>
        <Toast
          isOpen={toastIsOpen}
          handleClose={this.closeToast}
          message="You logged out!"
        />
        <SwipeableDrawer
          isOpen={drawerIsOpen}
          toggleDrawer={this.toggleDrawer}
        />
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={this.toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              FACT BOUNTY
            </Typography>
            <div className={classes.linkButtonsContainer}>
              {auth.isAuthenticated ? (
                <PrivateLinks handleLogout={this.handleLogout} />
              ) : (
                <PublicLinks />
              )}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object,
  logoutUser: PropTypes.func.isRequired
}

const NavBarWithStyles = withStyles(styles)(NavBar)

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { logoutUser }
)(NavBarWithStyles)
