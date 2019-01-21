import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import './Landing.sass'

class Landing extends Component {
	render() {
		return (
			<div className="landing-container">
				<Button variant="contained" color="primary" size="large">Register</Button>
				<Button variant="contained" color="primary" size="large">Log In</Button>
			</div>
		)
	}
}

export default Landing
