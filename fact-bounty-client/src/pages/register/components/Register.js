import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import '../styles/Register.sass'

import { registerUser } from '../actions/newUserActions'


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
			<div className="container">
				<div className="row rowDiv">
					<div className="col s8 offset-s2 outerDiv">
						<Card className="card">
							<form noValidate onSubmit={this.onSubmit}>
								<div className="input-field col s12 inputDiv">
									<label htmlFor="name">Name</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.name}
										error={errors.name}
										id="name"
										type="text"
										className={classnames('userInput', {
											invalid: errors.name
										})}
									/>
									<span className="red-text">{errors.name}</span>
								</div>
								<div className="input-field col s12 inputDiv">
									<label htmlFor="email">Email</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.email}
										error={errors.email}
										id="email"
										type="email"
										className={classnames('userInput', {
											invalid: errors.email
										})}
									/>
									<span className="red-text">{errors.email}</span>
								</div>
								<div className="input-field col s12 inputDiv">
									<label htmlFor="password">Password</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.password}
										error={errors.password}
										id="password"
										type="password"
										className={classnames('userInput', {
											invalid: errors.password
										})}
									/>
									<span className="red-text">{errors.password}</span>
								</div>
								<div className="input-field col s12 inputDiv">
									<label htmlFor="password2">Confirm Password</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.password2}
										error={errors.password2}
										id="password2"
										type="password"
										className={classnames('userInput', {
											invalid: errors.password2
										})}
									/>
									<span className="red-text">{errors.password2}</span>
								</div>
								<div className="col s12 inputDiv">
									<Button
										variant="contained"
										color="primary"
										type="submit"
										className="btn btn-large waves-effect waves-light hoverable blue accent-3"
									>
										Sign up
									</Button>
									<br></br>
									<Link to="/login">Have account.? Login</Link>
								</div>
							</form>
						</Card>
					</div>
				</div>
			</div>
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
