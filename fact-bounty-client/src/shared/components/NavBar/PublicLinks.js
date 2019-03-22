import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const PublicLinks = () => (
  <Fragment>
    <Link to="/" style={styles.link}>
      <Button color="inherit">Home</Button>
    </Link>
    <Link to="/about" style={styles.link}>
      <Button color="inherit">About</Button>
    </Link>
    <Link to="/register" style={styles.link}>
      <Button color="inherit">Sign Up</Button>
    </Link>
    <Link to="/login" style={styles.link}>
      <Button color="inherit">Login</Button>
    </Link>
  </Fragment>
);

const styles = {
  link: {
    color: "white",
    textDecoration: "none"
  }
};

export default PublicLinks;
