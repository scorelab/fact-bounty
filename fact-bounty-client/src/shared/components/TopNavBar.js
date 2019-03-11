import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ExpandMore, Person } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { logoutUser } from "../../pages/dashboard/actions/dashboardActions";

const styles = {
  navbar: {
    backgroundColor: "#fafafa",
    zIndex: "15"
  },
  navbarTitle: {
    flexGrow: 2,
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msUserSelect: "none",
    textDecoration: "none"
  },
  navbarLinks: {
    letterSpacing: "1px",
    fontWeight: "500",
    marginLeft: "24px"
  },
  link: {
    textDecoration: "none"
  }
};

class TopNavBar extends Component {
  constructor() {
    super();
    this.state = {};
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const guestLinks = (
      <div>
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
      </div>
    );

    const authLinks = (
      <Button style={styles.navbarLinks} onClick={this.onLogoutClick}>
        Logout
      </Button>
    );

    return (
      <AppBar position="fixed" color="default" style={styles.navbar}>
        <Toolbar>
          <Link to="/" style={styles.navbarTitle}>
            <Typography variant="h4" color="primary">
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
          {isAuthenticated ? authLinks : guestLinks}
        </Toolbar>
      </AppBar>
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
