import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { loginUser } from '../actions/authActions'
import '../styles/login.sass';

class Login extends Component {
	constructor() {
		super()
		this.state = {
			email: '',
			password: '',
			errors: {}
		}
	}

	componentDidMount() {
		// If logged in and user navigates to Login page, should redirect them to dashboard
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard')
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard') // push user to dashboard when they login
		}
		if (nextProps.errors) {
			this.setState({
				errors: nextProps.errors
			})
		}
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value })
	}
	onSubmit = e => {
		e.preventDefault()
		const userData = {
			email: this.state.email,
			password: this.state.password
		}
		this.props.loginUser(userData) // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
	}

	render() {
		const { errors } = this.state
		console.log(errors)
		return (
			<main>
			<CssBaseline />
			<Paper>
			  <Typography component="h1" variant="h5">
				Login
			  </Typography>
			  <form noValidate onSubmit={this.onSubmit}>
				<FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="email">Email Address</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.email}
									error={errors.email}
									id="email"
									type="email"
									className={classnames('', {
										invalid: errors.email || errors.emailnotfound
									})}/>
					<span className="red-text">
									{errors.email}
									{errors.emailnotfound}
								</span>
				</FormControl>
				
				<FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="password">Password</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.password}
									error={errors.password}
									id="password"
									type="password"
									className={classnames('', {
										invalid: errors.password || errors.passwordincorrect
									})} />
					<span className="red-text">
									{errors.password}
									{errors.passwordincorrect}
								</span>
				</FormControl>
				
				<Button type="submit" fullWidth variant="contained" color="primary">
				  Login
				</Button>
			  </form>
			</Paper>
		  </main>
			
		)
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(
	mapStateToProps,
	{ loginUser }
)(Login)
