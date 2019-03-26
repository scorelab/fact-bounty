import React, { Component } from "react";
import PropTypes from "prop-types";
import FacebookContainer from "./FacebookContainer";
import GoogleContainer from "./GoogleContainer";
import "./index.css";

class OauthContainer extends Component {
  render() {
    return (
      <div className="socialIconsSignup">
        <FacebookContainer button_type={this.props.button_type} />
        <GoogleContainer button_type={this.props.button_type} />
      </div>
    );
  }
}

OauthContainer.propTypes = {
  button_type: PropTypes.string
};

export default OauthContainer;
