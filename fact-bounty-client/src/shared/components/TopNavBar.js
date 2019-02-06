import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Person, ExpandMore } from '@material-ui/icons';
import { Menu, MenuItem } from '@material-ui/core';

class TopNavBar extends Component {

    state = {
        anchorEl: null
    };

    styles = {
        navbar: {
            backgroundColor: '#fafafa'
        },
        navbarTitle: {
            flexGrow: 1,
            textAlign: 'center',
            fontVariant: 'small-caps',
            letterSpacing: '1px',
            fontFamily: 'Aladin'
        },
        navbarLinks: {
            letterSpacing: '1px',
            fontWeight: '500',
            marginLeft: '24px'
        }
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
            <AppBar position="static" color="default" style={this.styles.navbar}>
                <Toolbar>
                    <Typography variant="h3" color="primary" style={this.styles.navbarTitle}>Fact Bounty</Typography>
                    <Button color="primary" style={this.styles.navbarLinks}>HOME</Button>
                    <Button color="primary" style={this.styles.navbarLinks}>ABOUT</Button>
                    <Button color="primary" style={this.styles.navbarLinks}
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