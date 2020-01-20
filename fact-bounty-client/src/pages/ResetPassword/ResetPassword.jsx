import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import compose from 'recompose/compose'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import Toast from '../../components/Toast'
import { updateError } from '../../redux/actions/errorActions'
import { resetPassword } from '../../redux/actions/authActions'
import styles from './ResetPassword.style'

class Register extends Component {
  constructor() {
    super()
    this.state = {
      verificationToken: '',
      password: '',
      password2: '',
      errors: {},
      showPassword: false,
      showPassword2: false,
      passwordValid: false,
      password2Valid: false,
      formValid: false,
      openToast: false
    }
  }

  componentDidMount() {
    this.props.updateError({})
    // set verification token
    const {
      match: { params }
    } = this.props
    this.setState({
      verificationToken: params.verificationToken
    })

    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }

  static getDerivedStateFromProps(props) {
    if (props.errors) {
      const errors = props.errors
      let openToast = false
      if (errors.fetch) {
        openToast = true
      }
      return { errors, openToast }
    }
    return null
  }

  onChange = e => {
    let { id, value } = e.target
    this.setState({ [id]: value }, () => {
      this.validateField(id, value)
    })
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }))
  }

  handleClickShowPassword2 = () => {
    this.setState(state => ({ showPassword2: !state.showPassword2 }))
  }

  validateField = (fieldName, value) => {
    let { passwordValid, password2Valid, errors } = this.state

    switch (fieldName) {
      case 'password':
        passwordValid = value.length >= 8
        errors.password = passwordValid ? '' : 'Too short!'
        password2Valid = value === this.state.password2
        if (password2Valid && passwordValid) {
          errors.password2 = null
        }
        break
      case 'password2':
        password2Valid = value === this.state.password
        errors.password2 = password2Valid ? '' : "Password don't match"
        break
      default:
        break
    }
    this.setState(
      {
        errors,
        passwordValid,
        password2Valid
      },
      this.validateForm
    )
  }

  validateForm = () => {
    this.setState({
      formValid: this.state.passwordValid && this.state.password2Valid
    })
  }
  closeToast = () => {
    // Remove error from store
    this.props.updateError({})
    this.setState({ openToast: false })
  }

  onSubmit = e => {
    e.preventDefault()
    // Remove error from store
    const { password, password2, verificationToken } = this.state

    if (password === password2) {
      const data = {
        password,
        password2,
        verificationToken
      }
      this.props.resetPassword(data, this.props.history)
    } else {
      const passwordError = 'Password dont match'
      const errors = {
        password2: password !== password2 ? passwordError : ''
      }
      this.props.updateError(errors)
    }
  }

  render() {
    const { errors, openToast } = this.state
    return (
      <main className={this.props.classes.main}>
        <CssBaseline />
        <Paper className={this.props.classes.paper}>
          {errors.fetch ? (
            <Toast
              open={openToast}
              onClose={this.closeToast}
              message="Something went wrong, Try again later"
              variant="error"
            />
          ) : null}
          <Avatar className={this.props.classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>

          <form
            noValidate
            onSubmit={this.onSubmit}
            className={this.props.classes.form}
          >
            <Typography component="span" variant="caption" color="error">
              {typeof this.props.errors === 'object'
                ? this.props.errors.message
                : null}
            </Typography>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">New Password</InputLabel>
              <Input
                autoComplete="on"
                onChange={this.onChange}
                value={this.state.password}
                error={!!errors.password}
                id="password"
                type={this.state.showPassword ? 'text' : 'password'}
                className={classnames('', {
                  invalid: errors.password
                })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography component="span" variant="caption" color="error">
                {errors.password}
              </Typography>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password2">Confirm New Password</InputLabel>
              <Input
                autoComplete="on"
                onChange={this.onChange}
                value={this.state.password2}
                error={!!errors.password2}
                id="password2"
                type={this.state.showPassword2 ? 'text' : 'password'}
                className={classnames('', {
                  invalid: errors.password2
                })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword2}
                    >
                      {this.state.showPassword2 ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Typography component="span" variant="caption" color="error">
                {errors.password2}
              </Typography>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.props.classes.submit}
              disabled={!this.state.formValid}
            >
              Change password
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

Register.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object,
  classes: PropTypes.object,
  updateError: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default compose(
  withStyles(styles, {
    name: 'Register'
  }),
  connect(mapStateToProps, { resetPassword, updateError })
)(Register)
