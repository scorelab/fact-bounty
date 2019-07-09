import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './styles.sass'
import Main from './js/main'

class TwitterGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryText: '',
      queryType: 'mixed'
    }
  }

  submitForm = () => {
    if (this.state.queryText.length === 0) {
      console.error('You must input a valid search query.')
    } else {
      const graphApp = Main(this.state.queryText, this.state.queryType)
    }
  }

  handleChange = event => {
    let { id, value } = event.target
    this.setState({ [id]: value })
  }

  componentDidMount() {
    // Twitter();
  }

  render() {
    return (
      <div className="twitterContainer">
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Twitter Network
        </h2>
        <div className="container">
          <form>
            <div className="search-form">
              <div className="pr-2 text-nowrap">Search by:</div>
              <div className="">
                <div className="btn-group btn-group-toggle pr-2">
                  <Button
                    disabled
                    id="searchByTwitter"
                    data-toggle="tooltip"
                    data-delay="0"
                    title="search Twitter content from the past 7 days"
                    type="Button"
                    color="primary"
                    variant="contained"
                  >
                    Twitter
                  </Button>
                </div>
              </div>
              <TextField
                variant="outlined"
                margin="normal"
                style={{ width: '80%' }}
                label="Enter any phrase"
                value={this.state.queryText}
                onChange={this.handleChange}
                id="queryText"
              />
            </div>
            <div className="check-box-list">
              <div className="radio-container">
                <label className="show-label">Show:</label>
                <input
                  type="radio"
                  name="sort_by"
                  id="queryType"
                  value="relevant"
                  onChange={this.handleChange}
                />{' '}
                Relevant
              </div>
              <span className="radio-container">
                <label className="">
                  <input
                    type="radio"
                    name="sort_by"
                    id="queryType"
                    value="recent"
                    onChange={this.handleChange}
                  />{' '}
                  Recent
                </label>
              </span>
              <span className="radio-container">
                <label className="">
                  <input
                    type="radio"
                    name="sort_by"
                    id="queryType"
                    value="mixed"
                    onChange={this.handleChange}
                  />{' '}
                  Mixed
                </label>
              </span>
            </div>
            <div className="col-12 text-center">
              <input
                type="hidden"
                name="include_user_mentions"
                id="include_user_mentions_true"
                value="true"
              />
              <Button
                className="btn btn-primary btn-blue"
                id="submit"
                variant="contained"
                color="primary"
                style={{ width: '50%' }}
                onClick={this.submitForm}
              >
                Search
              </Button>
            </div>
          </form>
        </div>
        <div
          id="graph-container"
          style={{ width: '100%', height: '80vh', margin: '0 auto' }}
        />
      </div>
    )
  }
}

export default TwitterGraph
