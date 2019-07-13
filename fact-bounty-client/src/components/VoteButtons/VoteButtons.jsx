import React, { Component } from 'react'
import { Icon } from '@material-ui/core'
import ReportProblem from '@material-ui/icons/ReportProblemOutlined'
import { withStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import Cancel from '@material-ui/icons/CancelOutlined'
import './style.sass'

class VoteButtons extends Component {
  handleClick = value => {
    const {
      loading,
      auth,
      user,
      post,
      approveVote,
      fakeVote,
      mixVote,
      currentVote
    } = this.props

    if (auth === false) {
      this.setState({
        redirect: true
      })
    } else if (value === 'approve' && loading === false) {
      approveVote(
        post._id,
        user.id,
        currentVote.voteType !== 'approve'
          ? 1
          : currentVote.voteValue === 1
          ? -1
          : 1,
        currentVote.voteIndex,
        currentVote.voteId,
        currentVote.voteType,
        currentVote.voteValue
      )
    } else if (value === 'fake' && loading === false) {
      fakeVote(
        post._id,
        user.id,
        currentVote.voteType !== 'fake'
          ? 1
          : currentVote.voteValue === 1
          ? -1
          : 1,
        currentVote.voteIndex,
        currentVote.voteId,
        currentVote.voteType,
        currentVote.voteValue
      )
    } else if (value === 'mix' && loading === false) {
      mixVote(
        post._id,
        user.id,
        currentVote.voteType !== 'mix'
          ? 1
          : currentVote.voteValue === 1
          ? -1
          : 1,
        currentVote.voteIndex,
        currentVote.voteId,
        currentVote.voteType,
        currentVote.voteValue
      )
    } else {
      console.error('Wrong vote type received ', value)
    }
  }

  userVoteButton(voteType) {
    const { currentVote, classes } = this.props
    if (voteType === 'approve') {
      if (currentVote.voteType === 'approve' && currentVote.voteValue === 1) {
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
      if (currentVote.voteType === 'fake' && currentVote.voteValue === 1) {
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
      if (currentVote.voteType === 'mix' && currentVote.voteValue === 1) {
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

  render() {
    const { post, classes } = this.props
    return (
      <div className="vote-buttons-container">
        <div className="btn-column">
          <div
            className="true-transition"
            onClick={() => this.handleClick('approve')}
          >
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
            {this.userVoteButton('mix')}
            <div className="mix-btn-hover">
              <Icon className={classes.mixBtnHover}>report_problem</Icon>
              <div className="mix-label">Mixture</div>
            </div>
          </div>
        </div>
        <div className="total-vote-count">
          {post.approved_count + post.fake_count + post.mixedvote_count} votes
        </div>
      </div>
    )
  }
}

const styles = {
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

export default compose(withStyles(styles))(VoteButtons)
