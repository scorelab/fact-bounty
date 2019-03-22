import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

const PrivateLinks = ({ handleLogout }) => (
  <List>
    <ListItem button>
      <Link to="/" style={styles.link}>
        Home
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/" style={styles.link}>
        About
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/dashboard" style={styles.link}>
        Profile
      </Link>
    </ListItem>
    <Divider />
    <ListItem button onClick={handleLogout} style={styles.logoutBtn}>
      Logout
    </ListItem>
    <Divider />
  </List>
);

const styles = {
  link: {
    color: "black",
    textDecoration: "none",
    padding: 10,
    display: "flex",
    flex: 1
  },
  logoutBtn: {
    color: "black",
    textDecoration: "none",
    padding: 24,
    display: "flex",
    flex: 1
  }
};

PrivateLinks.propTypes = {
  handleLogout: PropTypes.func.isRequired
};

export default PrivateLinks;
