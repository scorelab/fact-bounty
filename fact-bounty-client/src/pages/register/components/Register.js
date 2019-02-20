import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
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

import { registerUser } from '../actions/newUserActions';
import "../styles/register.sass"

class Register extends Component {
	constructor() {
		super()
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {}
		}
	}

	componentDidMount() {
		// If logged in and user navigates to Register page, should redirect them to dashboard
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard')
		}
	}

	componentWillReceiveProps(nextProps) {
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
		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		}
		this.props.registerUser(newUser, this.props.history)
	}

	render() {
		const { errors } = this.state
		return (
			<main>
			<CssBaseline />
			<Paper>
			  <Typography component="h1" variant="h5">
				Sign Up
			  </Typography>
			  <form noValidate onSubmit={this.onSubmit}>
			  <FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="email">Name</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.name}
									error={errors.name}
									id="name"
									type="text"
									className={classnames('', {
										invalid: errors.name
									})}/>
					<span className="red-text">{errors.name}</span>
				</FormControl>

				<FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="email">Email Address</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.email}
									error={errors.email}
									id="email"
									type="email"
									className={classnames('', {
										invalid: errors.email
									})}/>
					<span className="red-text">{errors.name}</span>
				</FormControl>
				
				<FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="password">Password</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.password}
									error={errors.password}
									id="password"
									type="password"
									className={classnames('', {
										invalid: errors.password
									})} />
					<span className="red-text">{errors.password}</span>
				</FormControl>

				<FormControl margin="normal" required fullWidth>
				  <InputLabel htmlFor="password2">Confirm Password</InputLabel>
				  <Input onChange={this.onChange}
									value={this.state.password2}
									error={errors.password2}
									id="password2"
									type="password"
									className={classnames('', {
										invalid: errors.password2
									})}/>
					<span className="red-text">{errors.password2}</span>
				</FormControl>
				
				<Button type="submit" fullWidth variant="contained" color="primary">
				  Sign Up
				</Button>
			  </form>
			</Paper>
		  </main>
		)
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
})

export default connect(
	mapStateToProps,
	{ registerUser }
)(withRouter(Register))
