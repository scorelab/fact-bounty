import React from "react";
import FacebookLogin from "react-facebook-login";
import { FaFacebookSquare } from "react-icons/fa";

import { OauthUser } from "./actions/OAuthUser";
import "./index.css";

class FacebookContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      status: "unknown",
      errors: null
    };
  }

  responseFacebook = res => {
    if (res.status !== "unknown") {
      const creds = {
        type: "facebook",
        name: res.name,
        email: res.email
      };
      OauthUser(creds);
    }
  };

  render() {
    return (
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        cssClass="fbauth"
        textButton="Login with facebook"
        fields="name,email,picture.width(400).height(400)"
        callback={this.responseFacebook}
        icon={
          <div
            style={{
              display: "inline-flex",
              padding: "10px 10px",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaFacebookSquare />
          </div>
        }
      />
    );
  }
}

export default FacebookContainer;
