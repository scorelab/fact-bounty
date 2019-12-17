import React, { Component } from 'react'
import { Card, CardContent, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import placeholder from '../../assets/img/placeholder.png'
import { changeVoteCount } from '../../redux/actions/postActions'
import VotesBar from '../VotesBar'
import VoteButtons from '../VoteButtons'
import moment from 'moment'
import './style.sass'

class PostItem extends Component {
  componentDidMount() {
    this.setState({
      postContent: this.props.post.content
    })
  }
  render() {
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
                    {!post.date || moment(new Date(post.date)).from(new Date())}
                  </div>
                  <div className="content">
                    {post.content.slice(0, 220).trim()}
                    {post.content.length > 220 ? '...' : ''}
                  </div>
                  <div className="btn-container">
                    <Link to={`post/${post._id}`} style={styles.link}>
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

            <VoteButtons
              loading={loading}
              post={post}
              changeVoteCount={changeVoteCount}
              isAuthenticated={auth.isAuthenticated}
              user={auth.user}
              userVote={userVote}
            />
          </Card>
        </div>
      </div>
    )
  }
}

PostItem.propTypes = {
  post: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.object,
  loading: PropTypes.bool,
  userVote: PropTypes.number,
  changeVoteCount: PropTypes.func
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
)(PostItem)
