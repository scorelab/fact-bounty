import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Menu, MenuItem } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import { logoutUser } from "../../pages/dashboard/actions/dashboardActions";
import "../navbar.css";

const breakpoints = {
  desktop: 1040,
  tablet: 840,
  mobile: 540
};

const styles = {
  navbar: {
    backgroundColor: "#fafafa",
    zIndex: "15",
    display: window.innerWidth > breakpoints.mobile ? "block" : "none"
  },
  navbarTitle: {
    flexGrow: 2,
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    textDecoration: "none"
  },
  headingTitle: {
    marginLeft: window.innerWidth > breakpoints.mobile ? 0 : "15px",
    padding: window.innerWidth > breakpoints.mobile ? 0 : "13px 0",
    fontSize: window.innerWidth > breakpoints.mobile ? "auto" : "1.5rem",
    position: "relative",
    zIndex: 6
  },
  navbarLinks: {
    letterSpacing: "1px",
    fontWeight: "500",
    marginLeft: "24px",
    fontSize: "1rem"
  },
  link: {
    textDecoration: "none"
  },
  avatar: {
    background: "#0388A6"
  },
  menu: {
    marginTop: "6vh"
  }
};

class TopNavBar extends Component {
  componentDidMount() {
    let menuIcon = document.querySelector(".menuIcon");
    let menuItems = document.querySelector("#menu");
    let nav = document.querySelector(".overlay-menu");

    menuIcon.addEventListener("click", () => {
      if (nav.style.transform !== "translateX(0%)") {
        nav.style.transform = "translateX(0%)";
        nav.style.transition = "transform 0.2s ease-out";
      } else {
        nav.style.transform = "translateX(-200%)";
        nav.style.transition = "transform 0.2s ease-out";
      }
    });

    // Toggle Menu Icon ========================================
    let toggleIcon = document.querySelector(".menuIcon");

    toggleIcon.addEventListener("click", () => {
      if (toggleIcon.className !== "menuIcon toggle") {
        toggleIcon.className += " toggle";
      } else {
        toggleIcon.className = "menuIcon";
      }
    });

    menuItems.addEventListener("click", () => {
      nav.style.transform = "translateX(-200%)";
      nav.style.transition = "transform 0.2s ease-out";
      toggleIcon.className = "menuIcon";
    });
  }

  state = {
    anchorEl: null,
    open: false,
    vertical: "top",
    horizontal: "center"
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState(state => ({
      anchorEl: null
    }));
  };
  handleLogout = () => {
    this.closeMenu();
    this.setState({ open: true, vertical: "top", horizontal: "center" });
    this.props.logoutUser();
  };

  render() {
    const { anchorEl, vertical, horizontal, open } = this.state;
    const { auth } = this.props;

    const NotAuthenticated = (
      <Fragment>
        <Link to="/register" style={styles.link}>
          <Button color="primary" style={styles.navbarLinks}>
            Sign Up
          </Button>
        </Link>
        <Link to="/login" style={styles.link}>
          <Button color="primary" style={styles.navbarLinks}>
            Login
          </Button>
        </Link>
      </Fragment>
    );

    const Authenticated = name => {
      return (
        <Fragment>
          <IconButton onClick={this.openMenu} style={styles.navbarLinks}>
            <Avatar style={styles.avatar}>{name[0]}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.closeMenu}
            style={styles.menu}
          >
            <MenuItem>
              <ListItemIcon>
                <Avatar style={styles.avatar}>{name[0]}</Avatar>
              </ListItemIcon>
              <ListItemText inset primary={name} />
            </MenuItem>
            <Link onClick={this.closeMenu} to="/dashboard" style={styles.link}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        </Fragment>
      );
    };

    const AuthenticatedMob = name => {
      return (
        <Fragment>
          <Link to="/profile" style={styles.link}>
            <Button color="primary" style={styles.navbarLinks}>
              Profile
            </Button>
          </Link>
          <Link to="/login" style={styles.link}>
            <Button
              onClick={this.handleLogout}
              color="primary"
              style={styles.navbarLinks}
            >
              Logout
            </Button>
          </Link>
        </Fragment>
      );
    };

    return (
      <div>
        <AppBar position="static" color="default" style={styles.navbar}>
          <Toolbar>
            <Link to="/" style={styles.navbarTitle}>
              <Typography
                variant="h4"
                color="primary"
                style={styles.headingTitle}
              >
                Fact Bounty
              </Typography>
            </Link>
            <Link to="/" style={styles.link}>
              <Button color="primary" style={styles.navbarLinks}>
                HOME
              </Button>
            </Link>
            <Link to="/about" style={styles.link}>
              <Button color="primary" style={styles.navbarLinks}>
                ABOUT
              </Button>
            </Link>
            {auth.isAuthenticated
              ? Authenticated(auth.user.name)
              : NotAuthenticated}
          </Toolbar>
        </AppBar>
        <div
          style={{
            padding: "5px 0",
            boxShadow: "rgba(136, 136, 136, 0.72) 0px -3px 13px 0px",
            backgroundColor: "white",
            top: 0,
            width: "100vw",
            position: "fixed",
            display: window.innerWidth > breakpoints.mobile ? "none" : "block",
            zIndex: 6
          }}
        >
          <div
            className="menuIcon"
            style={{
              display: window.innerWidth > breakpoints.mobile ? "none" : "block"
            }}
          >
            <span className="icon icon-bars" />
            <span className="icon icon-bars overlay" />
          </div>
          <Link to="/" style={styles.navbarTitle}>
            <Typography
              variant="h4"
              color="primary"
              style={styles.headingTitle}
            >
              Fact Bounty
            </Typography>
          </Link>
        </div>
        <div
          className="overlay-menu"
          style={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: 600,
            backgroundColor: "white",
            zIndex: 5,
            display: window.innerWidth > breakpoints.mobile ? "none" : "block"
          }}
        >
          <ul id="menu">
            <Link to="/" style={styles.link}>
              <Button color="primary" style={styles.navbarLinks}>
                HOME
              </Button>
            </Link>
            <Link to="/about" style={styles.link}>
              <Button color="primary" style={styles.navbarLinks}>
                ABOUT
              </Button>
            </Link>
            {auth.isAuthenticated
              ? AuthenticatedMob(auth.user.name)
              : NotAuthenticated}
          </ul>
        </div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">
              You have been logged out.
              <Link to="/login" style={styles.link}>
                <Button onClick={this.handleClose} style={{ color: "red" }}>
                  LOGIN again!
                </Button>
              </Link>
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}

TopNavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(TopNavBar);
