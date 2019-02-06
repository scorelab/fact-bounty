import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class TopNavBar extends Component {

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
    }

    render() {
        return (
            <AppBar position="static" color="default" style={this.styles.navbar}>
                <Toolbar>
                    <Typography variant="h3" color="primary" style={this.styles.navbarTitle}>Fact Bounty</Typography>
                    <Button color="primary" style={this.styles.navbarLinks}>HOME</Button>
                    <Button color="primary" style={this.styles.navbarLinks}>ABOUT</Button>
                </Toolbar>
            </AppBar>
        )
    }

}

export default TopNavBar;