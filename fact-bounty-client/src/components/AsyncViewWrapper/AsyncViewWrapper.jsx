import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import './style.sass'

const AsyncViewWrapper = ({ loading, children }) => {
  return (
    <div className="async-view-wrapper-container">
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

AsyncViewWrapper.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node
}

export default AsyncViewWrapper
