import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

import '../styles/Landing.sass'

class Landing extends Component {
	render() {
		return (
			<div className="landing-container">
				<Button variant="contained" color="primary" size="large" component={Link} to="/register">Register</Button>
				<Button variant="contained" color="primary" size="large" component={Link} to="/login">Log In</Button>
			</div>
		)
	}
}

export default Landing
