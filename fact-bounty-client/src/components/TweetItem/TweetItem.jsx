import React, { Component } from 'react'
import { Card, CardContent, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import placeholder from '../../assets/img/placeholder.png'
import { changeVoteCount } from '../../redux/actions/postActions'
import VotesBar from '../VotesBar'
import VoteButtons from '../VoteButtons'
import './style.sass'
import { Redirect } from 'react-router-dom'

class TweetItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      tweetUrl: null
    }
  }

  visualizeTweet = () => {
    const { _id, user } = this.props.post
    // console.log('https://twitter.com/' + user + '/status/' + _id)
    this.setState({
      redirect: true,
      tweetUrl: 'https://twitter.com/' + user + '/status/' + _id
    })
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard/twitter',
            state: { tweetUrl: this.state.tweetUrl }
          }}
        />
      )
    } else {
      const {
        post,
        classes,
        loading,
        auth,
        changeVoteCount,
        userVote
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
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{
                          width: 100,
                          padding: 5,
                          color: 'white',
                          marginBottom: 15
                        }}
                        onClick={this.visualizeTweet}
                      >
                        View
                    </Button>
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
              post={post}
              changeVoteCount={changeVoteCount}
              isAuthenticated={auth.isAuthenticated}
              user={auth.user}
              userVote={userVote}
            />
          </div>
        </div>
      )
    }
  }
}

TweetItem.propTypes = {
  post: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.object,
  loading: PropTypes.bool,
  userVote: PropTypes.number,
  changeVoteCount: PropTypes.func,
  _id: PropTypes.string,
  user: PropTypes.string
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
  loading: state.posts.loadingPosts,
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  changeVoteCount: (story_id, vote_value, userVote) =>
    dispatch(changeVoteCount(story_id, vote_value, userVote))
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(TweetItem)
