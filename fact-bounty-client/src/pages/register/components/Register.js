import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { Link as RouterLink } from "react-router-dom";

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
import { registerUser } from "../actions/newUserActions";
//import "../styles/register.sass"

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

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      showPassword: false,
      showPassword2: false,
      nameValid: false,
      emailValid: false,
      passwordValid: false,
      password2Valid: false,
      formValid: false,
      openToast: false
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    this.props.updateError({});
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  static getDerivedStateFromProps(props, state) {
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

  onChange = e => {
    let { id, value } = e.target;
    this.setState({ [id]: value }, () => {
      this.validateField(id, value);
    });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleClickShowPassword2 = () => {
    this.setState(state => ({ showPassword2: !state.showPassword2 }));
  };

  validateField = (fieldName, value) => {
    let {
      nameValid,
      emailValid,
      passwordValid,
      password2Valid,
      errors
    } = this.state;

    switch (fieldName) {
      case "name":
        nameValid = value.match(/^[a-zA-Z ]{2,30}$/i);
        errors.name = nameValid ? "" : "Invalid Name";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        errors.email = emailValid ? "" : "Invalid E-mail";
        break;
      case "password":
        passwordValid = value.length >= 8;
        errors.password = passwordValid ? "" : "Too short!";
        password2Valid = value === this.state.password2;
        if (password2Valid && passwordValid) {
          errors.password2 = null;
        }
        break;
      case "password2":
        password2Valid = value === this.state.password;
        errors.password2 = password2Valid ? "" : "Password don't match";
        break;
      default:
        break;
    }
    this.setState(
      {
        errors,
        nameValid,
        emailValid,
        passwordValid,
        password2Valid
      },
      this.validateForm
    );
  };

  validateForm = () => {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.nameValid &&
        this.state.passwordValid &&
        this.state.password2Valid
    });
  };
  closeToast = () => {
    // Remove error from store
    this.props.updateError({});
    this.setState({ openToast: false });
  };

  onSubmit = e => {
    e.preventDefault();
    // Remove error from store
    const { name, email, password, password2 } = this.state;
    var patt = new RegExp("[a-zA-z s]{4,32}");

    if (password === password2 && patt.test(name)) {
      const newUser = {
        name,
        email,
        password,
        password2
      };
      this.props.registerUser(newUser, this.props.history);
    } else {
      const nameError = "Name should only be alphabet";
      const passwordError = "Password don't match";
      const errors = {
        password2: password !== password2 ? passwordError : "",
        name: patt.test(name) ? "" : nameError
      };
      this.props.updateError(errors);
    }
  };

  render() {
    const { errors, openToast } = this.state;
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
            Sign Up
          </Typography>

          <form
            noValidate
            onSubmit={this.onSubmit}
            className={this.props.classes.form}
          >
            <Typography component="span" variant="caption" color="error">
              {typeof this.props.errors !== "object" ? this.props.errors : null}
            </Typography>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                onChange={this.onChange}
                value={this.state.name}
                error={!!errors.name}
                id="name"
                type="text"
                className={classnames("", {
                  invalid: errors.name
                })}
              />
              <Typography component="span" variant="caption" color="error">
                {errors.name}
              </Typography>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                onChange={this.onChange}
                value={this.state.email}
                error={!!errors.email}
                id="email"
                type="email"
                className={classnames("", {
                  invalid: errors.email
                })}
              />
              <Typography component="span" variant="caption" color="error">
                {errors.email}
              </Typography>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={this.onChange}
                value={this.state.password}
                error={!!errors.password}
                id="password"
                type={this.state.showPassword ? "text" : "password"}
                className={classnames("", {
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
              <InputLabel htmlFor="password2">Confirm Password</InputLabel>
              <Input
                onChange={this.onChange}
                value={this.state.password2}
                error={!!errors.password2}
                id="password2"
                type={this.state.showPassword2 ? "text" : "password"}
                className={classnames("", {
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
              Sign Up
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
            <OauthContainer />
          </form>
          <p>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Login.
            </Link>
          </p>
        </Paper>
      </main>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
    name: "Register"
  }),
  connect(
    mapStateToProps,
    { registerUser, updateError }
  )
)(Register);
