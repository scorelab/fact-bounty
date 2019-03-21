import React from "react";
import { GoogleLogin } from "react-google-login";
import { OauthUser } from "./actions/OAuthUser";

import "./index.css";

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
    return (
      <GoogleLogin
        className="googleSignin"
        style={{ width: "15rem" }}
        buttonText="Login with google"
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={this.responseGoogle}
        onFailure={this.errors}
        icon="true"
      />
    );
  }
}

export default GoogleContainer;
