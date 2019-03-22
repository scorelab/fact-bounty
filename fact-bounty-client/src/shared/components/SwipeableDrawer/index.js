import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import PublicLinks from "./PublicLinks";
import PrivateLinks from "./PrivateLinks";
import Toast from "../Toast";
import { logoutUser } from "../../../pages/dashboard/actions/dashboardActions";

class SwipeableDrawer extends React.Component {
  // constructor
  constructor(props) {
    super(props);
    this.state = {
      toastIsOpen: false
    };
  }

  // Show Toast method
  showToast = () => {
    this.setState({ toastIsOpen: true });
  };

  // close Toast method
  closeToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ toastIsOpen: false });
  };

  // handle user logout
  handleLogout = () => {
    this.showToast();
    this.props.logoutUser();
  };

  render() {
    const { classes, isOpen, toggleDrawer, auth } = this.props;
    const { toastIsOpen } = this.state;
    return (
      <div>
        <Toast
          isOpen={toastIsOpen}
          handleClose={this.closeToast}
          message="You logged out!"
        />
        <Drawer open={isOpen} onClose={toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <div className={classes.list}>
              {auth.isAuthenticated ? (
                <PrivateLinks handleLogout={this.handleLogout} />
              ) : (
                <PublicLinks />
              )}
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const styles = {
  list: {
    width: 250
  }
};

SwipeableDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func,
  auth: PropTypes.object,
  logoutUser: PropTypes.func,
  toastIsOpen: PropTypes.bool
};

const SwipeableDrawerWithStyles = withStyles(styles)(SwipeableDrawer);

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(SwipeableDrawerWithStyles);
