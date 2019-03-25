import React from "react";

import FacebookContainer from "./FacebookContainer";
import GoogleContainer from "./GoogleContainer";
import "./index.css";

const OauthContainer = () => (
  <div className="socialIconsSignup">
    <FacebookContainer />
    <GoogleContainer />
  </div>
);

export default OauthContainer;
