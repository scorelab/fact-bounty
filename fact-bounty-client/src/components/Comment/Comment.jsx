import React, { Component } from 'react'
import { Card, CardContent, CardHeader, Grid, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import './style.sass'

class Comment extends Component {
  render() {
    const { comment, classes, handleComment } = this.props

    return (
      <Card className={classes.card} variant="outlined">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid container direction="column" justify="space-around" xs={10}>
            <CardHeader title={comment.username} style={styles.cardHeader} />

            <CardContent style={styles.cardContent}>
              {comment.content}
            </CardContent>
          </Grid>
          <Grid container direction="column" justify="space-around" xs={2}>
            <Button
              onClick={handleComment}
              variant="contained"
              color="primary"
              style={styles.replyButton}
            >
              Reply
            </Button>
          </Grid>
        </Grid>
      </Card>
    )
  }
}

Comment.propTypes = {
  comment: PropTypes.object,
  classes: PropTypes.object,
  handleComment: PropTypes.func
}

const styles = {
  replyButton: {
    margin: '15px 35px 15px 15px'
  },
  cardContent: {
    padding: '12px',
    paddingTop: '2px'
  },
  cardHeader: {
    fontWeight: '800',
    padding: '12px',
    paddingBottom: '2px'
  },
  card: {
    margin: '12px',
    backgroundColor: '#fafafa',
    color: '#424242',
    transition: '0.1s ease',
    '&:hover': {
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default compose(withStyles(styles), connect(mapStateToProps)
)(Comment)
