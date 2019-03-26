import React from "react";
import FacebookLogin from "react-facebook-login";
import { FaFacebookSquare } from "react-icons/fa";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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
      this.props.OauthUser(creds);
    }
  };

  render() {
    return (
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        cssClass="fbauth"
        textButton={
          this.props.button_type === "Signup"
            ? "Signup with Facebook"
            : this.props.button_type === "Login"
            ? "Login with Facebook"
            : null
        }
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

FacebookContainer.propTypes = {
  OauthUser: PropTypes.func.isRequired,
  button_type: PropTypes.string
};

const mapStateToProps = null;

const mapDispatchToProps = {
  OauthUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FacebookContainer);
