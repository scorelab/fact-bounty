import React, { Component } from 'react'
import { Card, CardContent, Icon, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ReportProblem from '@material-ui/icons/ReportProblemOutlined'
import Cancel from '@material-ui/icons/CancelOutlined'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import './style.sass'

import placeholder from '../../assets/img/placeholder.png'
import { approveVote, fakeVote, mixVote } from '../../redux/actions/postActions'

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

  findHighestVotesColor(post) {
    let value
    if (post.approved_count >= post.fake_count) {
      if (post.approved_count >= post.mixedvote_count) {
        value = '#009688'
      } else {
        value = '#1564c0'
      }
    } else {
      if (post.fake_count >= post.mixedvote_count) {
        value = '#f4511e'
      } else {
        value = '#1564c0'
      }
    }
    return value
  }

  displayVote(value, totalVotes) {
    return (value / totalVotes) * 100 > 3
      ? Math.round((value / totalVotes) * 1000) / 10 + '%'
      : ''
  }

  handleClick = value => {
    if (this.props.auth === false) {
      this.setState({
        redirect: true
      })
    } else if (value === 'approve' && this.props.loading === false) {
      this.props.approveVote(
        this.props.post._id,
        this.props.user_id,
        this.props.currentVote.voteType !== 'approve'
          ? 1
          : this.props.currentVote.voteValue === 1
          ? -1
          : 1,
        this.props.currentVote.voteIndex,
        this.props.currentVote.voteId,
        this.props.currentVote.voteType,
        this.props.currentVote.voteValue
      )
    } else if (value === 'fake' && this.props.loading === false) {
      this.props.fakeVote(
        this.props.post._id,
        this.props.user_id,
        this.props.currentVote.voteType !== 'fake'
          ? 1
          : this.props.currentVote.voteValue === 1
          ? -1
          : 1,
        this.props.currentVote.voteIndex,
        this.props.currentVote.voteId,
        this.props.currentVote.voteType,
        this.props.currentVote.voteValue
      )
    } else if (value === 'mix' && this.props.loading === false) {
      this.props.mixVote(
        this.props.post._id,
        this.props.user_id,
        this.props.currentVote.voteType !== 'mix'
          ? 1
          : this.props.currentVote.voteValue === 1
          ? -1
          : 1,
        this.props.currentVote.voteIndex,
        this.props.currentVote.voteId,
        this.props.currentVote.voteType,
        this.props.currentVote.voteValue
      )
    } else {
      console.error('Wrong vote type received ', value)
    }
  }

  userVoteButton(voteType) {
    const { classes } = this.props
    if (voteType === 'approve') {
      if (
        this.props.currentVote.voteType === 'approve' &&
        this.props.currentVote.voteValue === 1
      ) {
        return (
          <div className="true-btn" style={{ opacity: 1 }}>
            <Icon className={classes.trueBtnHover}>check_circle</Icon>
          </div>
        )
      } else {
        return (
          <div className="true-btn">
            <Icon className={classes.icon}>check_circle_outline</Icon>
          </div>
        )
      }
    } else if (voteType === 'fake') {
      if (
        this.props.currentVote.voteType === 'fake' &&
        this.props.currentVote.voteValue === 1
      ) {
        return (
          <div className="fake-btn" style={{ opacity: 1 }}>
            <Icon className={classes.fakeBtnHover}>cancel</Icon>
          </div>
        )
      } else {
        return (
          <div className="fake-btn">
            <Cancel className={classes.icon} />
          </div>
        )
      }
    } else if (voteType === 'mix') {
      if (
        this.props.currentVote.voteType === 'mix' &&
        this.props.currentVote.voteValue === 1
      ) {
        return (
          <div className="mix-btn" style={{ opacity: 1 }}>
            <Icon className={classes.mixBtnHover}>report_problem</Icon>
          </div>
        )
      } else {
        return (
          <div className="mix-btn">
            <ReportProblem className={classes.icon} />
          </div>
        )
      }
    } else {
      console.warn('Wrong vote type')
    }
  }

  renderVotes = () => {
    const { post } = this.props
    const totalVotes =
      post.approved_count + post.fake_count + post.mixedvote_count
    const highestVotes = this.findHighestVotesColor(post)
    return (
      <div className="vote-status" style={{ backgroundColor: highestVotes }}>
        <div
          className="votes true-votes"
          style={{ width: (post.approved_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {this.displayVote(post.approved_count, totalVotes)}
          </span>
        </div>
        <div
          className="votes fake-votes"
          style={{ width: (post.fake_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {this.displayVote(post.fake_count, totalVotes)}
          </span>
        </div>
        <div
          className="votes mix-votes"
          style={{ width: (post.mixedvote_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {this.displayVote(post.mixedvote_count, totalVotes)}
          </span>
        </div>
      </div>
    )
  }

  renderVoteButtons = () => {
    const { post, classes } = this.props
    return (
      <div>
        <div className="btn-column">
          <div
            className="true-transition"
            onClick={() => this.handleClick('approve')}
          >
            {/* <div className='true-btn'>
        <Icon className={classes.icon}>check_circle_outline</Icon>
      </div> */}
            {this.userVoteButton('approve')}
            <div className="true-btn-hover">
              <Icon className={classes.trueBtnHover}>check_circle</Icon>
              <div className="true-label">True</div>
            </div>
          </div>
          <div
            className="fake-transition"
            onClick={() => this.handleClick('fake')}
          >
            {/* <div className='fake-btn'>
        <Cancel className={classes.icon} />
      </div> */}
            {this.userVoteButton('fake')}
            <div className="fake-btn-hover">
              <Icon className={classes.fakeBtnHover}>cancel</Icon>
              <div className="fake-label">Fake</div>
            </div>
          </div>
          <div
            className="mix-transition"
            onClick={() => this.handleClick('mix')}
          >
            {/* <div className='mix-btn'>
        <ReportProblem className={classes.icon} />
      </div> */}
            {this.userVoteButton('mix')}
            <div className="mix-btn-hover">
              <Icon className={classes.mixBtnHover}>report_problem</Icon>
              <div className="mix-label">Mixture</div>
            </div>
          </div>
        </div>
        <div className="total-vote-count">
          {post.approved_count + post.fake_count + post.mixedvote_count}
          votes
        </div>
      </div>
    )
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />
    } else {
      const { post, classes } = this.props

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
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                {this.renderVotes()}
              </CardContent>
            </Card>
            {this.renderVoteButtons()}
          </div>
        </div>
      )
    }
  }
}
// }

PostItem.propTypes = {
  fakeVote: PropTypes.func,
  approveVote: PropTypes.func,
  mixVote: PropTypes.func,
  post: PropTypes.object,
  classes: PropTypes.object,
  auth: PropTypes.bool,
  user_id: PropTypes.number,
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
  },
  icon: {
    fontSize: '30px'
  },
  trueBtnHover: {
    color: '#009688',
    fontSize: '30px'
  },
  fakeBtnHover: {
    color: '#f4511e',
    fontSize: '30px'
  },
  mixBtnHover: {
    color: '#1564c0',
    fontSize: '30px'
  }
}

const mapStateToProps = state => ({
  loading: state.posts.loading,
  error: state.posts.error,
  auth: state.auth.isAuthenticated,
  user_id: state.auth.user.sub
})

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { approveVote, fakeVote, mixVote }
  )
)(PostItem)
