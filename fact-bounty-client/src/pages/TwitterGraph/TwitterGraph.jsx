/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './styles.sass'
import './external.css'
import './nv.d3.css'
import Main from './js/main'
import AsyncViewWrapper from '../../components/AsyncViewWrapper/AsyncViewWrapper'
import PropTypes from 'prop-types'

class TwitterGraph extends Component {
  graphApp
  test
  constructor(props) {
    super(props)
    this.state = {
      queryText: '',
      queryType: 'mixed',
      node_modal_content: {
        staleAcctInfo: {
          isStale: false,
          newId: '',
          oldSn: '',
          newSn: ''
        },
        showStaleContent: true,
        user_id: '',
        screenname: '',
        has_quoted: [],
        has_mentioned: [],
        has_retweeted: [],
        is_quoted_by: [],
        is_mentioned_by: [],
        is_retweeted_by: [],
        has_quoted_count: 0,
        has_mentioned_count: 0,
        has_retweeted_count: 0,
        is_quoted_by_count: 0,
        is_mentioned_by_count: 0,
        is_retweeted_by_count: 0,
        completeAutomationProbability: 0,
        botscore: 0,
        botcolor: 0
      },
      show_node_modal: false,
      loading: false,
      visible: '0vh',
      graphAnimation: {
        playing: false,
        paused: false
      }
    }
  }

  componentDidMount() {
    if (this.props.location.state) {
      const url = this.props.location.state.tweetUrl
      if (url) {
        this.setState(
          {
            queryText: url
          },
          this.submitForm
        )
      }
    }
  }

  submitForm = () => {
    if (this.state.queryText.length === 0) {
      console.error('You must input a valid search query.')
    } else {
      this.setState({
        loading: true,
        visible: '0vh'
      })
      this.graphApp = new Main(this.state.queryText, this.state.queryType)
      this.graphApp.getModalObservable().subscribe(event => {
        this.setState({
          node_modal_content: event,
          show_node_modal: true
        })
      })
      this.graphApp.getGraphBuildObservable().subscribe(event => {
        this.setState({
          loading: !event
        })
        if (event) {
          this.setState({
            visible: 'auto'
          })
        }
      })
    }
  }

  handleChange = event => {
    let { id, value } = event.target
    this.setState({ [id]: value })
  }

  toggleNodeModal = () => {
    this.graphApp.toggleNodeModal()
    this.setState({
      show_node_modal: false
    })
  }

  screenNameChange = () => {
    if (
      this.state.node_modal_content.showStaleContent &&
      this.state.node_modal_content.staleAcctInfo.isStale
    ) {
      return (
        <div className="alert bg-warning">
          Warning: This account has changed its screen name from
          <a
            href={
              'https://twitter.com/' +
              this.state.node_modal_content.staleAcctInfo.oldSn
            }
            target="_blank"
          >
            {this.state.node_modal_content.staleAcctInfo.oldSn}
          </a>{' '}
          (
          <a
            href={
              'https://botometer.iuni.iu.edu/#!/?sn=' +
              this.state.node_modal_content.staleAcctInfo.oldSn
            }
            target="_blank"
          >
            details
          </a>
          ) to
          <a
            href={
              'https://twitter.com/intent/user?user_id=' +
              this.state.node_modal_content.staleAcctInfo.newId
            }
            target="_blank"
          >
            {this.state.node_modal_content.staleAcctInfo.newSn}
          </a>{' '}
          (
          <a
            href={
              'https://botometer.iuni.iu.edu/#!/?sn=' +
              this.state.node_modal_content.staleAcctInfo.newSn
            }
            target="_blank"
          >
            details
          </a>
          )
        </div>
      )
    }
  }

  hasQuoted = () => {
    const rows = []
    const has_quoted = this.state.node_modal_content.has_quoted
    if (
      this.state.node_modal_content &&
      this.state.node_modal_content.has_quoted_count > 0
    ) {
      let i = 0
      let j = 0
      // this.state.node_modal_content.is_retweeted_by.map(user => {
      for (let user in has_quoted) {
        i++
        const row = (
          <div key={i}>
            <h3>
              Account :{' '}
              <a target="_blank" href={has_quoted[user].user_url}>
                {has_quoted[user].screenName}
              </a>
            </h3>
            {has_quoted[user].article_titles.map((title, index) => {
              j++
              return (
                <div key={j}>
                  <div className="article_headline">{title}</div>
                  <div className="modal_links">
                    <a
                      target="_blank"
                      href={has_quoted[user].tweet_urls[index]}
                    >
                      tweet
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
        rows.push(row)
      }
      return rows
      // })
    } else {
      return <span>nobody</span>
    }
  }

  wasQuotedBy = () => {
    const rows = []
    const is_quoted_by = this.state.node_modal_content.is_quoted_by
    if (
      this.state.node_modal_content &&
      this.state.node_modal_content.is_quoted_by_count > 0
    ) {
      let i = 0
      let j = 0
      // this.state.node_modal_content.is_retweeted_by.map(user => {
      for (let user in is_quoted_by) {
        i++
        const row = (
          <div key={i}>
            <h3>
              Account :{' '}
              <a target="_blank" href={is_quoted_by[user].user_url}>
                {is_quoted_by[user].screenName}
              </a>
            </h3>
            {is_quoted_by[user].article_titles.map((title, index) => {
              j++
              return (
                <div key={j}>
                  <div className="article_headline">{title}</div>
                  <div className="modal_links">
                    <a
                      target="_blank"
                      href={is_quoted_by[user].tweet_urls[index]}
                    >
                      tweet
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
        rows.push(row)
      }
      return rows
      // })
    } else {
      return <span>nobody</span>
    }
  }

  wasMentionedBy = () => {
    const rows = []
    const is_mentioned_by = this.state.node_modal_content.is_mentioned_by
    if (
      this.state.node_modal_content &&
      this.state.node_modal_content.is_mentioned_by_count > 0
    ) {
      let i = 0
      let j = 0
      // this.state.node_modal_content.is_retweeted_by.map(user => {
      for (let user in is_mentioned_by) {
        i++
        const row = (
          <div key={i}>
            <h3>
              Account :{' '}
              <a target="_blank" href={is_mentioned_by[user].user_url}>
                {is_mentioned_by[user].screenName}
              </a>
            </h3>
            {is_mentioned_by[user].article_titles.map((title, index) => {
              j++
              return (
                <div key={j}>
                  <div className="article_headline">{title}</div>
                  <div className="modal_links">
                    <a
                      target="_blank"
                      href={is_mentioned_by[user].tweet_urls[index]}
                    >
                      tweet
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
        rows.push(row)
      }
      return rows
      // })
    } else {
      return <span>nobody</span>
    }
  }

  hasRetweeted = () => {
    const rows = []
    const has_retweeted = this.state.node_modal_content.has_retweeted
    if (
      this.state.node_modal_content &&
      this.state.node_modal_content.has_retweeted_count > 0
    ) {
      let i = 0
      let j = 0
      // this.state.node_modal_content.is_retweeted_by.map(user => {
      for (let user in has_retweeted) {
        i++
        const row = (
          <div key={i}>
            <h3>
              Account :{' '}
              <a target="_blank" href={has_retweeted[user].user_url}>
                {has_retweeted[user].screenName}
              </a>
            </h3>
            {has_retweeted[user].article_titles.map((title, index) => {
              j++
              return (
                <div key={j}>
                  <div className="article_headline">{title}</div>
                  <div className="modal_links">
                    <a
                      target="_blank"
                      href={has_retweeted[user].tweet_urls[index]}
                    >
                      tweet
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
        rows.push(row)
      }
      return rows
      // })
    } else {
      return <span>nobody</span>
    }
  }

  wasRetweetedBy = () => {
    const rows = []
    const is_retweeted_by = this.state.node_modal_content.is_retweeted_by
    if (
      this.state.node_modal_content &&
      this.state.node_modal_content.is_retweeted_by_count > 0
    ) {
      let i = 0
      let j = 0
      // this.state.node_modal_content.is_retweeted_by.map(user => {
      for (let user in is_retweeted_by) {
        i++
        const row = (
          <div key={i}>
            <h3>
              Account :{' '}
              <a target="_blank" href={is_retweeted_by[user].user_url}>
                {is_retweeted_by[user].screenName}
              </a>
            </h3>
            {is_retweeted_by[user].article_titles.map((title, index) => {
              j++
              return (
                <div key={j}>
                  <div className="article_headline">{title}</div>
                  <div className="modal_links">
                    <a
                      target="_blank"
                      href={is_retweeted_by[user].tweet_urls[index]}
                    >
                      tweet
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )
        rows.push(row)
      }
      return rows
      // })
    } else {
      return <span>nobody</span>
    }
  }

  startGraphAnimation = () => {
    this.graphApp.startGraphAnimation()
    this.setState({
      graphAnimation: {
        playing: true,
        paused: false
      }
    })
  }

  unpauseGraphAnimation = () => {
    this.graphApp.unpauseGraphAnimation()
    this.setState({
      graphAnimation: {
        playing: true,
        paused: false
      }
    })
  }

  pauseGraphAnimation = () => {
    this.graphApp.pauseGraphAnimation()
    this.setState({
      graphAnimation: {
        playing: true,
        paused: true
      }
    })
  }

  stopGraphAnimation = () => {
    this.graphApp.stopGraphAnimation()
    this.setState({
      graphAnimation: {
        playing: false,
        paused: false
      }
    })
  }

  render() {
    const loading = <AsyncViewWrapper loading={this.state.loading} />
    let playBtn, unpauseBtn, pauseBtn, stopBtn
    if (!this.state.graphAnimation.playing) {
      playBtn = (
        <button
          className="animation-control btn btn-primary"
          onClick={this.startGraphAnimation}
        >
          <i className="fa fa-play" aria-hidden="true" />
        </button>
      )
    }
    if (this.state.graphAnimation.playing && this.state.graphAnimation.paused) {
      unpauseBtn = (
        <button
          className="animation-control btn btn-primary"
          onClick={this.unpauseGraphAnimation}
        >
          <i className="fa fa-play" aria-hidden="true" />
        </button>
      )
    }
    if (
      !this.state.graphAnimation.paused &&
      this.state.graphAnimation.playing
    ) {
      pauseBtn = (
        <button
          className="animation-control btn btn-primary"
          onClick={this.pauseGraphAnimation}
        >
          <i className="fa fa-pause" aria-hidden="true" />
        </button>
      )
    }
    stopBtn = (
      <button
        className="animation-control btn btn-primary"
        onClick={this.stopGraphAnimation}
        disabled={!this.state.graphAnimation.playing}
      >
        <i className="fa fa-stop" aria-hidden="true" />
      </button>
    )
    return (
      <div
        className={
          'twitterContainer ' + (this.state.show_node_modal ? 'modal-open' : '')
        }
      >
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
          Twitter Network
        </h2>
        <div className="container">
          <form>
            <div className="search-form">
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
        {loading}
        <div
          className="twitter-container"
          style={{ height: this.state.visible, overflow: 'hidden' }}
        >
          <div id="timeline" className="timeline">
            <p>Timeline</p>
            <div id="chart" className="chart">
              <svg />
            </div>
            <div id="focus_label">
              Select and drag a time frame of interest above
            </div>
          </div>
          <div className="button-column">
            <p>Play</p>
            {playBtn}
            {unpauseBtn}
            {pauseBtn}
            {stopBtn}
          </div>
          <div className="twitter-graph">
            <div
              id="graph-container"
              style={{ width: '100%', height: '80vh', margin: '0 auto' }}
            />
          </div>
        </div>
        <div
          id="nodeModal"
          className={
            'modal  ' + (this.state.show_node_modal ? 'modal-show' : '')
          }
          // onClick={this.toggleNodeModal}
          role="dialog"
          style={{ opacity: this.state.show_node_modal ? '1' : '0' }}
          aria-labelledby="nodeModalLabel"
          tabIndex="-1"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  onClick={this.toggleNodeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title text-center" id="nodeModalLabel">
                  Account:{' '}
                  <a
                    target="_blank"
                    href={
                      'https://twitter.com/intent/user?user_id=' +
                      this.state.node_modal_content
                        ? this.state.node_modal_content.user_id
                        : ''
                    }
                  >
                    {this.state.node_modal_content.screenName}
                  </a>
                </h4>
              </div>
              <div className="modal-body">
                <div>
                  <h5>
                    Botometer Score:{' '}
                    {!this.state.node_modal_content.botscore ? (
                      <span>
                        <b>Unavailable</b>
                      </span>
                    ) : (
                      ''
                    )}
                  </h5>
                  {this.state.node_modal_content.botscore < 0 ? (
                    <span>
                      Could not be retrieved. It is possible that this account's
                      timeline is set to private or has been deleted entirely.
                    </span>
                  ) : (
                    ''
                  )}
                  {this.state.node_modal_content.botscore > 0 ? (
                    <div>Last calculated: </div>
                  ) : (
                    ''
                  )}
                  {this.screenNameChange()}
                  {!this.state.node_modal_content.showStaleContent ? (
                    <div className="alert modal-informational">
                      Details not available. Click the Update button to fetch
                      latest bot score and details for this account.
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <h2>has quoted: </h2>
                {this.hasQuoted()}
                <h2>was quoted by: </h2>
                {this.wasQuotedBy()}
                <h2>was mentioned by: </h2>
                {this.wasMentionedBy()}
                <h2>has retweeted: </h2>
                {this.hasRetweeted()}
                <h2>was retweeted by: </h2>
                {this.wasRetweetedBy()}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.toggleNodeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TwitterGraph.propTypes = {
  location: PropTypes.object
}

export default TwitterGraph
