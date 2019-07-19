import React, { Component } from 'react'
import { Icon } from '@material-ui/core'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import './style.sass'

class VoteButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false
    }
  }

  handleClick = vote_value => {
    const { loading, isAuthenticated, user, post, changeVoteCount } = this.props

    if (!isAuthenticated) {
      this.setState({ redirect: true })
      return
    }

    console.log(vote_value)
    if (!loading) {
      changeVoteCount(post._id, vote_value)
    }
  }

  render() {
    const { post } = this.props
    const totalVotes =
      post.approved_count + post.fake_count + post.mixedvote_count
    if (this.state.redirect) {
      return <Redirect to="/login" />
    }
    return (
      <div className="vote-buttons-container">
        <div className="buttons">
          <div className="trueBtn" onClick={() => this.handleClick(1)}>
            <Icon className="trueIcon">check_circle</Icon>
            <label className="trueLbl">True</label>
          </div>
          <div className="fakeBtn" onClick={() => this.handleClick(-1)}>
            <Icon className="fakeIcon">cancel</Icon>
            <label className="fakeLbl">Fake</label>
          </div>
          <div className="mixBtn" onClick={() => this.handleClick(0)}>
            <Icon className="mixIcon">report_problem</Icon>
            <label className="mixLbl">Mix</label>
          </div>
        </div>
        <div className="vote_count">
          <label>{totalVotes} Vote(s)</label>
        </div>
      </div>
    )
  }
}

VoteButtons.propTypes = {
  post: PropTypes.object,
  loading: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  changeVoteCount: PropTypes.func
}

export default VoteButtons
