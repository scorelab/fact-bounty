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
import { forgotPassword } from '../../redux/actions/authActions'
import styles from './ForgotPassword.style'

class ForgotPassword extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      errors: {},
      emailValid: false,
      formValid: false,
      openToast: false
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.updateError({})
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
    return null
  }

  onChange = e => {
    let { id, value } = e.target
    this.setState({ [id]: value }, () => {
      this.validateField(value)
    })
  }

  validateField = value => {
    let { emailValid, errors } = this.state

    emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    errors.email = emailValid ? '' : 'Invalid E-mail'

    this.setState(
      {
        errors,
        emailValid
      },
      this.validateForm
    )
  }

  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid
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
    const { email } = this.state
    this.props.forgotPassword({ email: email })
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
              {typeof this.props.errors !== 'object' ? this.props.errors : null}
            </Typography>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.props.classes.submit}
              disabled={!this.state.formValid}
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      </main>
    )
  }
}

ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object,
  classes: PropTypes.object,
  updateError: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})

export default compose(
  withStyles(styles, {
    name: 'ForgotPassword'
  }),
  connect(
    mapStateToProps,
    { forgotPassword, updateError }
  )
)(ForgotPassword)
