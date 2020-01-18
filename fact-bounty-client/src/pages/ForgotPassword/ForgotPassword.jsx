import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
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
import { updateSuccess } from '../../redux/actions/successActions'
import {
  forgotPassword,
  authVerificationToken
} from '../../redux/actions/authActions'
import styles from './ForgotPassword.style'

class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      verificationToken: '',
      errors: {},
      success: {},
      emailValid: false,
      verificationTokenValid: false,
      formValid: false,
      openToast: false
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.updateError({})
    this.props.updateSuccess({})
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.errors) {
      const errors = props.errors
      let openToast = false
      if (errors.fetch) {
        openToast = true
      }
      return { errors, openToast }
    }
    if (props.success) {
      const success = props.success
      let openToast = false
      if (success.fetch) {
        openToast = true
      }
      return { success, openToast }
    }
    return null
  }

  onChange = e => {
    let { id, value } = e.target
    this.setState({ [id]: value }, () => {
      this.validateField(id, value)
    })
  }

  validateField = (fieldname, value) => {
    let { emailValid, verificationTokenValid, errors } = this.state

    emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    verificationTokenValid = !!this.state.verificationToken
    switch (fieldname) {
      case 'email':
        errors.email = emailValid ? '' : 'Invalid E-mail'
    }
    this.setState(
      {
        errors,
        emailValid,
        verificationTokenValid
      },
      this.validateForm
    )
  }

  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid || this.state.verificationToken !== ''
    })
  }
  closeToast = () => {
    // Remove error from store
    this.props.updateError({})
    this.props.updateSuccess({})
    this.setState({ openToast: false })
  }

  onSubmit = e => {
    e.preventDefault()
    // Remove error from store
    this.props.updateSuccess({})
    this.props.updateError({})

    const { email } = this.state
    if (!this.props.success.message) {
      this.props.forgotPassword({ email: email })
    } else {
      this.props.authVerificationToken(
        {
          verification_token: this.state.verificationToken
        },
        this.props.history
      )
    }
  }

  render() {
    const { errors, openToast } = this.state
    var formInput, buttonName
    if (!this.props.success.message) {
      formInput = (
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">Email Address</InputLabel>
          <Input
            autoComplete="on"
            onChange={this.onChange}
            value={this.state.email}
            error={!!errors.email}
            id="email"
            type="email"
            className={classnames('', {
              invalid: errors.email
            })}
          />
          <Typography component="span" variant="caption" color="error">
            {errors.email}
          </Typography>
        </FormControl>
      )
      buttonName = 'Send verification code'
    } else {
      formInput = (
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="verificationToken">
            Verification token
          </InputLabel>
          <Input
            autoComplete="on"
            onChange={this.onChange}
            value={this.state.verificationToken}
            id="verificationToken"
          />
        </FormControl>
      )
      buttonName = 'Verify token'
    }
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
            Forgot Password
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
            <Typography
              component="span"
              variant="caption"
              color="primary"
              align="center"
            >
              {typeof this.props.success === 'object'
                ? this.props.success.message
                : null}
            </Typography>
            {formInput}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.props.classes.submit}
              disabled={!this.state.formValid}
            >
              {buttonName}
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  authVerificationToken: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired,
  history: PropTypes.object,
  classes: PropTypes.object,
  updateError: PropTypes.func.isRequired,
  updateSuccess: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
})

export default compose(
  withStyles(styles, {
    name: 'ForgotPassword'
  }),
  connect(
    mapStateToProps,
    { forgotPassword, authVerificationToken, updateError, updateSuccess }
  )
)(ForgotPassword)
