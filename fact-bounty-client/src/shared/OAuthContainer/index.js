import React from "react";

import styles from "./index.css";

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
        <FacebookContainer class={styles.facebookIconSignup} />
      ),
      GoogleContainer: <GoogleContainer class={styles.googleIconSignup} />
    });
  }

  render() {
    return (
      <div className={styles.socialIconsSignup}>
        {this.state.FacebookContainer}
        {this.state.GoogleContainer}
      </div>
    );
  }
}

export default OauthContainer;
