import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormLabel from '@material-ui/core/FormLabel';
import { loginUser } from '../actions/authActions'
import '../styles/Login.sass'

const styles = {
	card: {
		width: 350,
		height: 350,
	},
	inputDiv: {
		margin: 20,
		padding: 5
	},
	input: {
		width: 270
	},
	outerDiv: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		width: '170px',
		borderRadius: '3px',
		letterSpacing: '1.5px',
		margin: '1rem 0'
	}
}

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
		return (
			<div className="container">
				<div style={{ marginTop: '8rem', width:"100%" }} className="row">
					<div className="col s4" style={styles.outerDiv}>
						<Card style={styles.card}>
							<form noValidate onSubmit={this.onSubmit}>
								<div className="input-field col s12" style={styles.inputDiv}>
									<label htmlFor="email">Email</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.email}
										error={errors.email}
										id="email"
										type="email"
										style={styles.input}
										className={classnames('', {
											invalid: errors.email || errors.emailnotfound
										})}
									/>
									<span className="red-text">
										{errors.email}
										{errors.emailnotfound}
									</span>
								</div>
								<div className="input-field col s12" style={styles.inputDiv}>
									<label htmlFor="password">Password</label>
									<br></br>
									<Input
										onChange={this.onChange}
										value={this.state.password}
										error={errors.password}
										id="password"
										type="password"
										style={styles.input}
										className={classnames('', {
											invalid: errors.password || errors.passwordincorrect
										})}
									/>
									<span className="red-text">
										{errors.password}
										{errors.passwordincorrect}
									</span>
								</div>
								<div className="col s12" style={styles.inputDiv}>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										style={styles.button}
										className="btn btn-large waves-effect waves-light hoverable blue accent-3"
									>
										Login
									</Button>
									<br></br>
									
								</div>
							</form>
						</Card>
					</div>
				</div>
			</div>
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
