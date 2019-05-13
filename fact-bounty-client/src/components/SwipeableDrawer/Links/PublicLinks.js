import React from 'react'
import Divider from '@material-ui/core/Divider'
import { Link } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

const PublicLinks = () => (
  <List>
    <ListItem button>
      <Link to="/" style={styles.link}>
        Home
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/posts" style={styles.link}>
        Posts
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/about" style={styles.link}>
        About
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/register" style={styles.link}>
        Sign Up
      </Link>
    </ListItem>
    <Divider />
    <ListItem button>
      <Link to="/login" style={styles.link}>
        Login
      </Link>
    </ListItem>
    <Divider />
  </List>
)

const styles = {
  link: {
    color: 'black',
    textDecoration: 'none',
    padding: 10,
    display: 'flex',
    flex: 1
  }
}

export default PublicLinks
