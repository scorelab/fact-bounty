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
    <Link to="/about" style={styles.link}>
      <Button color="inherit">About</Button>
    </Link>
    <Link to="/register" style={styles.link}>
      <Button color="inherit">Sign Up</Button>
    </Link>
    <Link to="/login" style={styles.link}>
      <Button variant="contained" color="primary">
        Login
      </Button>
    </Link>
  </Fragment>
)

const styles = {
  link: {
    color: 'black',
    textDecoration: 'none',
    margin: 5
  }
}

export default PublicLinks
