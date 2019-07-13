import React, { Component } from 'react'
import { Card, CardContent, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import { Redirect, Link } from 'react-router-dom'
import placeholder from '../../assets/img/placeholder.png'
import { approveVote, fakeVote, mixVote } from '../../redux/actions/postActions'
import VotesBar from '../VotesBar'
import VoteButtons from '../VoteButtons'
import './style.sass'

class PostItem extends Component {
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

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />
    } else {
      const {
        post,
        classes,
        loading,
        auth,
        user,
        approveVote,
        fakeVote,
        mixVote,
        currentVote
      } = this.props

      return (
        <div className="post-item-wrapper">
          <div className="hover-container">
            <Card className={classes.card}>
              <CardContent style={styles.cardContent}>
                <div className="post-container">
                  <div className="image">
                    <img
                      src={post.imageLink ? post.imageLink : placeholder}
                      alt="fact-bounty"
                      className="post-img"
                    />
                  </div>
                  <div className="details">
                    <div className="title">{post.title}</div>
                    <div className="date">
                      {new Date(post.date).toUTCString()}
                    </div>
                    <div className="content">
                      {post.content.slice(0, 220).trim()}
                      {post.content.length > 220 ? '...' : ''}
                    </div>
                    <div className="btn-container">
                      <Link to={`/post/${post._id}`} style={styles.link}>
                        <Button
                          variant="contained"
                          color="secondary"
                          style={{
                            width: 100,
                            padding: 5,
                            color: 'white',
                            marginBottom: 15
                          }}
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <VotesBar
                  approved_count={post.approved_count}
                  mixedvote_count={post.mixedvote_count}
                  fake_count={post.fake_count}
                />
              </CardContent>
            </Card>
            <VoteButtons
              loading={loading}
              auth={auth}
              user={user}
              post={post}
              approveVote={approveVote}
              fakeVote={fakeVote}
              mixVote={mixVote}
              currentVote={currentVote}
            />
          </div>
        </div>
      )
    }
  }
}

PostItem.propTypes = {
  fakeVote: PropTypes.func,
  approveVote: PropTypes.func,
  mixVote: PropTypes.func,
  post: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.bool,
  user: PropTypes.object,
  loading: PropTypes.bool,
  currentVote: PropTypes.object
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
  loading: state.posts.loading,
  error: state.posts.error,
  auth: state.auth.isAuthenticated,
  user: state.auth.user
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { approveVote, fakeVote, mixVote }
  )
)(PostItem)
