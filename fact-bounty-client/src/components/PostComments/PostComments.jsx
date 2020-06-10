import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import './style.sass'
import { Redirect } from 'react-router-dom'
import Comment from '../Comment'
import CommentForm from '../CommentForm'

class PostComments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  componentDidMount() {
    this.setState({
      postContent: this.props.post.content
    })
  }

  handleComment() {
    const { isAuthenticated } = this.props || false
    if (!isAuthenticated) {
      this.setState({ redirect: true })
      return
    }
  }

  render() {
    const { classes, comments } = this.props

    if (this.state.redirect) {
      return <Redirect to="/login" />
    }

    return (
      <div className="post-item-wrapper">
        <div className="hover-container">
          {comments.map(comment => {
            return (
              <Comment
                classes={classes}
                key={comment.key}
                comment={comment}
                handleComment={this.handleComment}
              />
            )
          })}
        </div>
        <CommentForm handleComment={this.handleComment} />
      </div>
    )
  }
}

PostComments.propTypes = {
  post: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  comments: PropTypes.object
}

const styles = {
  cardContent: {
    padding: 0
  },
  card: {
    marginBottom: '12px',
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

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(PostComments)
