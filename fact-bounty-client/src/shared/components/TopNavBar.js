import React, {Component}   from 'react'
import Button               from '@material-ui/core/Button'
import AppBar               from '@material-ui/core/AppBar'
import Toolbar              from '@material-ui/core/Toolbar'
import Typography           from '@material-ui/core/Typography'
import {ExpandMore, Person} from '@material-ui/icons'
import {Menu, MenuItem}     from '@material-ui/core'
import {Link}               from 'react-router-dom'

const styles = {
	navbar: {
		backgroundColor: '#fafafa',
		zIndex: '15'
	},
	navbarTitle: {
		flexGrow: 2,
		MozUserSelect: 'none',
		WebkitUserSelect: 'none',
		msUserSelect: 'none',
		textDecoration: 'none'
	},
	navbarLinks: {
		letterSpacing: '1px',
		fontWeight: '500',
		marginLeft: '24px'
	},
	link: {
		textDecoration: 'none'
	}
}

class TopNavBar extends Component {

	state = {
		anchorEl: null
	}

	handleToggle = event => {
		this.setState({anchorEl: event.currentTarget})
	}

	handleClose = () => {
		this.setState(state => ({
			anchorEl: null
		}))
	}

	render() {
		const {anchorEl} = this.state
		return (
			<AppBar position="fixed" color="default" style={styles.navbar}>
				<Toolbar>
					<Link to="/" style={styles.navbarTitle}>
						<Typography variant="h4" color="primary">Fact Bounty</Typography>
					</Link>
					<Link to="/" style={styles.link}>
						<Button color="primary" style={styles.navbarLinks}>HOME</Button>
					</Link>
					<Link to="/about" style={styles.link}>
						<Button color="primary" style={styles.navbarLinks}>ABOUT</Button>
					</Link>
					<Link to="/register" style={styles.link}>
						<Button color="primary" style={styles.navbarLinks}>Sign Up</Button>
					</Link>
					<Link to="/login" style={styles.link}>
						<Button color="primary" style={styles.navbarLinks}>Login</Button>
					</Link>
				</Toolbar>
			</AppBar>
		)
	}

}

export default TopNavBar
