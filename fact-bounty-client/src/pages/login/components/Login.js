import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Link as RouterLink, Redirect } from "react-router-dom";
import compose from "recompose/compose";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "@material-ui/core/Link";

import OauthContainer from "../../../shared/OAuthContainer";
import Toast from "../../../shared/components/Snackbar";
import { updateError } from "../../../shared/actions/errorActions";
import { loginUser } from "../actions/authActions";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      showPassword: false,
      emailValid: false,
      passwordValid: false,
      formValid: false,
      openToast: false,
      redirect: false
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    this.props.updateError({});
    if (this.props.auth.isAuthenticated) {
      this.setState({ redirect: true });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.auth.isAuthenticated) {
      return { redirect: true };
    }
    if (props.errors) {
      const errors = props.errors;
      let openToast = false;
      if (errors.fetch) {
        openToast = true;
      }
      return { errors, openToast };
    }
    return null;
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  onChange = e => {
    let { id, value } = e.target;
    this.setState({ [id]: value }, () => {
      this.validateField(id, value);
    });
  };

  validateField = (fieldName, value) => {
    let { emailValid, passwordValid, errors } = this.state;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        errors.email = emailValid ? "" : "Invalid E-mail";
        break;
      case "password":
        passwordValid = value.length > 0;
        errors.password = passwordValid ? "" : "Password cannot be left blank!";
        break;
      default:
        break;
    }
    this.setState(
      {
        errors,
        emailValid,
        passwordValid
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    this.props.loginUser(userData);
  };
  closeToast = () => {
    // remove error from store after notifying user
    this.props.updateError({});
    this.setState({ openToast: false });
  };

  onKeyDown = e => {
    if (e.getModifierState("CapsLock")) {
      const passwordError = "Caps Lock is on!";
      const errors = {
        password: passwordError
      };
      this.setState({ errors });
    } else {
      const errors = {};
      this.setState({ errors });
    }
  };

  render() {
    const { errors, openToast, redirect } = this.state;
    if (redirect) {
      return <Redirect to="/dashboard" />;
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
            Login
          </Typography>
          <form
            noValidate
            onSubmit={this.onSubmit}
            className={this.props.classes.form}
          >
            <Typography component="span" variant="caption" color="error">
              {this.props.errors.message !== undefined
                ? this.props.errors.message
                : null}
            </Typography>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                onChange={this.onChange}
                value={this.state.email}
                error={!!errors.email}
                id="email"
                type="email"
                className={classnames("", {
                  invalid: errors.email || errors.emailnotfound
                })}
                autoComplete="on"
              />
              <Typography component="span" variant="caption" color="error">
                {errors.email}
                {errors.emailnotfound}
              </Typography>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={this.onChange}
                onKeyDownCapture={this.onKeyDown}
                value={this.state.password}
                error={!!errors.password}
                id="password"
                type={this.state.showPassword ? "text" : "password"}
                className={classnames("", {
                  invalid: errors.password || errors.passwordincorrect
                })}
                autoComplete="on"
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
                {errors.passwordincorrect}
              </Typography>
              <span className="red-text" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.props.classes.submit}
              disabled={!this.state.formValid}
            >
              Login
            </Button>

            <div
              style={{
                width: "100%",
                height: 14,
                margin: "30px 0px",
                borderBottom: "1px solid #00000033",
                textAlign: "center"
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  padding: "0px 5px",
                  backgroundColor: "white"
                }}
              >
                OR
              </span>
            </div>
            <OauthContainer button_type="Login" />
          </form>
          <p>
            Don&apos;t have an account?&nbsp;
            <Link component={RouterLink} to="/register">
              Create One.
            </Link>
          </p>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object,
  classes: PropTypes.object,
  updateError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default compose(
  withStyles(styles, {
    name: "Login"
  }),
  connect(
    mapStateToProps,
    { loginUser, updateError }
  )
)(Login);
