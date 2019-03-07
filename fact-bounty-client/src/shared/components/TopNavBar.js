import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ExpandMore, Person } from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
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
    display: window.innerWidth > breakpoints.tablet ? "block" : "none"
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
    marginLeft: "24px",
    fontSize: "1.5rem"
  },
  link: {
    textDecoration: "none"
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
    anchorEl: null
  };

  handleToggle = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState(state => ({
      anchorEl: null
    }));
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <div>
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
          </Toolbar>
        </AppBar>
        <div
          className="menuIcon"
          style={{
            display: window.innerWidth > breakpoints.tablet ? "none" : "block"
          }}
        >
          <span className="icon icon-bars" />
          <span className="icon icon-bars overlay" />
        </div>
        <div
          className="overlay-menu"
          style={{
            fontFamily: "Open Sans, sans-serif",
            fontWeight: 600,
            display: window.innerWidth > breakpoints.tablet ? "none" : "block"
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
          </ul>
        </div>
      </div>
    );
  }
}

export default TopNavBar;
