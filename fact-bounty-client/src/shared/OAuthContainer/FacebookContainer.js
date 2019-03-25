import React from "react";
import FacebookLogin from "react-facebook-login";
import Button from "@material-ui/core/Button";

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
        render={renderProps => (
          <Button onClick={renderProps.onClick}>
            <i className="fa fa-facebook" /> Login with facebook
          </Button>
        )}
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        // autoLoad
        cssClass="fbauth"
        fields="name,email,picture.width(400).height(400)"
        callback={this.responseFacebook}
        // icon={<i style={{ color: "#29487d" }} className="fa fa-facebook" />}
      />
    );
  }
}

export default FacebookContainer;
