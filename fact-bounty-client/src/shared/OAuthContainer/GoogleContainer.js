import Button from "@material-ui/core/Button";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { OauthUser } from "./actions/OAuthUser";
import styles from "./index.css";

class GoogleContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      status: "unknown",
      errors: null
    };
  }

  responseGoogle = res => {
    const creds = {
      type: "google",
      name: res.profileObj.name,
      email: res.profileObj.email
    };
    OauthUser(creds);
  };

  errors = err => {
    console.log(err);
  };

  render() {
    const { errors } = this.state;
    return (
      <GoogleLogin
        render={renderProps => (
          <Button className={styles.fbauth} onClick={renderProps.onClick}>
            <img
              style={{ width: "14px", marginRight: "7px" }}
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="icon"
            />
            Login with Google
          </Button>
        )}
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={this.responseGoogle}
        onFailure={this.errors}
      />
    );
  }
}

export default GoogleContainer;
