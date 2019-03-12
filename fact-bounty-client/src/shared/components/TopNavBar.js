import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ExpandMore, Person } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
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
  },
  avatar: {
    background: "#0388A6"
  },
  menu: {
    marginTop: "6vh"
  }
};

class TopNavBar extends Component {
  state = {
    anchorEl: null
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
    this.props.logoutUser();
  };

  render() {
    const { anchorEl } = this.state;
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
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        </Fragment>
      );
    };

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
          {auth.isAuthenticated
            ? Authenticated(auth.user.name)
            : NotAuthenticated}
        </Toolbar>
      </AppBar>
    );
  }
}

TopNavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(TopNavBar);
