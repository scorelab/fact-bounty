import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

const PublicLinks = () => (
  <Fragment>
    <Link to="/" style={styles.link}>
      <Button color="inherit">Home</Button>
    </Link>
    <Link to="/posts" style={styles.link}>
      <Button color="inherit">Posts</Button>
    </Link>
    <Link to="/#about" style={styles.link}>
      <Button color="inherit">About</Button>
    </Link>
    <Link to="/#contact" style={styles.link}>
      <Button color="inherit">Contact Us</Button>
    </Link>
    <span style={styles.btnContainer}>
      <Link to="/register" style={styles.link}>
        <Button variant="outlined" color="primary">
          Sign Up
        </Button>
      </Link>
      <Link to="/login" style={styles.link}>
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Link>
    </span>
  </Fragment>
)

const styles = {
  link: {
    color: 'black',
    textDecoration: 'none',
    margin: 5
  },
  btnContainer: {
    marginLeft: 10
  }
}

export default PublicLinks
