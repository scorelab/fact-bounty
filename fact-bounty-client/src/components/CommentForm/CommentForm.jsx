import React, { Component } from 'react'
import { Grid, Button, TextField, InputAdornment } from '@material-ui/core'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import './style.sass'

class CommentForm extends Component {
  render() {
    const { classes, handleComment } = this.props

    return (
      <form
        className={classes.root}
        noValidate
        onSubmit={handleComment}
        autoComplete="off"
      >
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid container direction="column" justify="space-around" xs={10}>
            <TextField
              id="comment-input"
              label="Add a comment"
              variant="outlined"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <ChatBubbleIcon />
                </InputAdornment>
              }
              style={styles.commentForm}
            />
          </Grid>
          <Grid container direction="column" justify="space-around" xs={2}>
            <Button
              variant="contained"
              color="primary"
              style={styles.submitButton}
            >
              Post
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}

CommentForm.propTypes = {
  classes: PropTypes.object,
  handleComment: PropTypes.func
}

const styles = {
  submitButton: {
    margin: '15px 35px 15px 15px'
  },
  commentForm: {
    margin: '15px 15px 15px 15px',
    width: '98%'
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(CommentForm)
