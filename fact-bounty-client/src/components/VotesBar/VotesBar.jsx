import React from 'react'
import PropTypes from 'prop-types'
import './style.sass'

const VotesBar = ({ approved_count, mixedvote_count, fake_count }) => {
  const displayVote = (value, totalVotes) => {
    return (value / totalVotes) * 100 > 3
      ? Math.round((value / totalVotes) * 1000) / 10 + '%'
      : ''
  }

  const findHighestVotesColor = (
    approved_count,
    mixedvote_count,
    fake_count
  ) => {
    let value
    if (approved_count >= fake_count) {
      if (approved_count >= mixedvote_count) {
        value = '#009688'
      } else {
        value = '#1564c0'
      }
    } else {
      if (fake_count >= mixedvote_count) {
        value = '#f4511e'
      } else {
        value = '#1564c0'
      }
    }
    return value
  }

  const totalVotes = approved_count + fake_count + mixedvote_count
  const highestVotesColor = findHighestVotesColor(
    approved_count,
    mixedvote_count,
    fake_count
  )

  return (
    <div className="votes-bar-container">
      <div
        className="vote-status"
        style={{ backgroundColor: highestVotesColor }}
      >
        <div
          className="votes true-votes"
          style={{ width: (approved_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {displayVote(approved_count, totalVotes)}
          </span>
        </div>
        <div
          className="votes fake-votes"
          style={{ width: (fake_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {displayVote(fake_count, totalVotes)}
          </span>
        </div>
        <div
          className="votes mix-votes"
          style={{ width: (mixedvote_count / totalVotes) * 100 + '%' }}
        >
          <span className="vote-value">
            {displayVote(mixedvote_count, totalVotes)}
          </span>
        </div>
      </div>
    </div>
  )
}

VotesBar.propTypes = {
  approved_count: PropTypes.number,
  mixedvote_count: PropTypes.number,
  fake_count: PropTypes.number
}

export default VotesBar
