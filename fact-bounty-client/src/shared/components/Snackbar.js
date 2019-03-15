import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import PropTypes from "prop-types";
import classnames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  error: {
    backgroundColor: "#bb0000",
    maxWidth: "300px"
  },
  success: {
    backgroundColor: "green"
  }
};

function Toast(props) {
  const { open, onClose, message, classes, variant, className } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      autoHideDuration={4000}
    >
      <SnackbarContent
        onClose={onClose}
        className={classnames(classes[variant], className)}
        message={message}
        aria-describedby="client-snackbar"
      />
    </Snackbar>
  );
}

Toast.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default withStyles(styles)(Toast);
