import React from "react";

import "./index.css";

class OauthContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      FacebookContainer: null,
      GoogleContainer: null
    };
  }

  async componentDidMount() {
    const { default: FacebookContainer } = await import("./FacebookContainer");
    const { default: GoogleContainer } = await import("./GoogleContainer");
    this.setState({
      loading: false,
      FacebookContainer: (
        // <FacebookContainer class={styles.facebookIconSignup} />
        <FacebookContainer />
      ),
      // GoogleContainer: <GoogleContainer class={styles.googleIconSignup} />
      GoogleContainer: <GoogleContainer />
    });
  }

  render() {
    return (
      <div className="socialIconsSignup">
        {this.state.FacebookContainer}
        {this.state.GoogleContainer}
      </div>
    );
  }
}

export default OauthContainer;
