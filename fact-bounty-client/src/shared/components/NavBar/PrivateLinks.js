import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { Menu, MenuItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

class PrivateLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState(state => ({
      anchorEl: null
    }));
  };

  render() {
    const { anchorEl } = this.state;
    const { auth, handleLogout } = this.props;
    return (
      <Fragment>
        <Link to="/" style={styles.link}>
          <Button color="inherit">Home</Button>
        </Link>
        <Link to="/about" style={styles.link}>
          <Button color="inherit">About</Button>
        </Link>
        <IconButton onClick={this.openMenu} style={styles.navbarLinks}>
          <Avatar style={styles.avatar}>
            {auth.user.name ? auth.user.name[0] : "O"}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.closeMenu}
          style={styles.menu}
        >
          <MenuItem>
            <ListItemIcon>
              <Avatar style={styles.avatar}>
                {auth.user.name ? auth.user.name[0] : "o"}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              inset
              primary={auth.user.name ? auth.user.name : "no name"}
            />
          </MenuItem>
          <Link to="/dashboard" style={styles.link}>
            <MenuItem>Profile</MenuItem>
          </Link>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Fragment>
    );
  }
}
const styles = {
  link: {
    color: "white",
    textDecoration: "none"
  },
  avatar: {
    background: "#0388A6"
  },
  menu: {
    marginTop: "6vh"
  }
};

PrivateLinks.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateLinks);
