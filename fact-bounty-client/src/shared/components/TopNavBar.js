import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Person, ExpandMore } from '@material-ui/icons';
import { Menu, MenuItem } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = {
    navbar: {
        backgroundColor: '#fafafa',
        zIndex: '15'
    },
    navbarTitle: {
        flexGrow: 2,
        textAlign: 'center',
        fontVariant: 'small-caps',
        letterSpacing: '1px',
        fontFamily: 'Aladin'
    },
    navbarLinks: {
        letterSpacing: '1px',
        fontWeight: '500',
        marginLeft: '24px'
    },
    link: {
        textDecoration: 'none'
    }
};

class TopNavBar extends Component {

    state = {
        anchorEl: null
    };

    handleToggle = event => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose = () => {
        this.setState(state => ({
            anchorEl: null
        }));
    }

    render() {
        const { anchorEl } = this.state;
        return (
            <AppBar position="static" color="default" style={styles.navbar}>
                <Toolbar>
                    <div style={{ height: '10px', width: '14%' }}></div>
                    <Typography variant="h3" color="primary" style={styles.navbarTitle}>Fact Bounty</Typography>
                    <Link to="/" style={styles.link}>
                        <Button color="primary" style={styles.navbarLinks}>HOME</Button>
                    </Link>
                    <Link to="/about" style={styles.link}>
                        <Button color="primary" style={styles.navbarLinks} >ABOUT</Button>
                    </Link>
                    <Button color="primary" style={styles.navbarLinks}
                        onClick={this.handleToggle} aria-haspopup="true"
                        aria-owns={anchorEl ? 'simple-menu' : undefined}>
                        <Person /> <ExpandMore />
                    </Button>
                    <Menu id="simple-menu" anchorEl={anchorEl}
                        open={Boolean(anchorEl)} onClose={this.handleClose}>
                        <MenuItem onClick={this.handleClose}>Login</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        )
    }

}

export default TopNavBar;