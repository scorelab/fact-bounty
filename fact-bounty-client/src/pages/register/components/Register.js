import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'

import compose from 'recompose/compose';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { registerUser } from '../actions/newUserActions';
//import "../styles/register.sass"

const styles = theme => ({
	main: {
	  width: 'auto',
	  display: 'block', // Fix IE 11 issue.
	  marginLeft: theme.spacing.unit * 3,
	  marginRight: theme.spacing.unit * 3,
	  [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
		width: 400,
		marginLeft: 'auto',
		marginRight: 'auto',
	  },
	},
	paper: {
	  marginTop: theme.spacing.unit * 12,
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	  padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
	  margin: theme.spacing.unit,
	  backgroundColor: theme.palette.secondary.main,
	},
	form: {
	  width: '100%', // Fix IE 11 issue.
	  marginTop: theme.spacing.unit,
	},
	submit: {
	  marginTop: theme.spacing.unit * 3,
	},
  });

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
			<main className = {this.props.classes.main}>
			<CssBaseline />
			<Paper className= {this.props.classes.paper}>
				<Avatar className={this.props.classes.avatar}>
				<LockOutlinedIcon />
				</Avatar>
			  <Typography component="h1" variant="h5">
				Sign Up
			  </Typography>
			  <form noValidate onSubmit={this.onSubmit} className = {this.props.classes.form}>
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
				
				<Button type="submit" fullWidth variant="contained" 
					color="primary" className = {this.props.classes.submit}>
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

export default compose(
    withStyles(styles, {
        name: 'Register',
    }),
    connect(
		mapStateToProps,
		{ registerUser }
	)
)(Register);
