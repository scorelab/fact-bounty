/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-loop-func */
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './styles.sass'
import Main from './js/main'

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
      show_node_modal: false
    }
  }

  submitForm = () => {
    if (this.state.queryText.length === 0) {
      console.error('You must input a valid search query.')
    } else {
      this.graphApp = new Main(this.state.queryText, this.state.queryType)
      this.graphApp.getModalObservable().subscribe(event => {
        this.setState({
          node_modal_content: event,
          show_node_modal: true
        })
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

  componentDidMount() {
    // Twitter();
  }

  render() {
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
        <div className="twitter-graph">
          <div
            id="graph-container"
            style={{ width: '100%', height: '80vh', margin: '0 auto' }}
          />
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

export default TwitterGraph
