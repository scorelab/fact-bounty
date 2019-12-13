import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Footer from '../../components/Footer'
import patch2 from '../../assets/img/patch2.png'
import patch3 from '../../assets/img/patch3.png'
import PostsList from '../../components/PostsList'
import './style.sass'
import UserInfo from '../../components/UserInfo'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0
    }
  }

  componentDidMount() {
    this.initHashScroll()
  }

  componentDidUpdate() {
    this.initHashScroll()
  }

  initHashScroll = () => {
    if (window.location.hash) {
      const section = document.querySelector(`${window.location.hash}`)
      if (section) {
        section.scrollIntoView()
      }
    }
  }

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    })
  }

  handleChangeIndex = index => {
    this.setState({
      value: index
    })
  }

  render() {
    const { value } = this.state
    return (
      <div className="landing-container">
        <div className="patch-wrapper-2">
          <img src={patch2} alt="patch" />
        </div>
        <div className="patch-wrapper-3">
          <img src={patch3} alt="patch" />
        </div>
        {/* ============= PROFILE SECTION ============= */}
        <div className="container">
          {' '}
          <div className="row">
            <div>
              <UserInfo
                name="Johnny Appleseed"
                bio="I am a independent journalist at CNN working to improve the credibility of online media.
                With this, I will attempt to fact check every tweet to the best of my ability."
              />

              <Link to="/follow">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: 120, marginTop: 15 }}
                >
                  Follow
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: 160, marginLeft: 10, marginTop: 15 }}
                >
                  More Options
                </Button>
              </Link>
            </div>
          </div>
          <div className="card" style={{ marginTop: 30 }}>
            <div className="card-body">
              Amazing work with your posts! <br />
              <b>Anonymous User</b>
            </div>
          </div>
          <div className="card" style={{ marginTop: 15 }}>
            <div className="card-body">
              <label>
                <b>Provide feedback on Johnny Appleseed&apos;s posts...</b>
              </label>
              <input
                type="text"
                id="placeholderForm"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* ============= RECENT POSTS SECTION ============= */}
        <div className="container" id="recentPosts">
          <div className="recent-posts">
            <h1>Recent Posts</h1>
            <PostsList limit={4} />
            <Link to="/posts">
              <div className="view-all-btn">
                <label>View All</label>
                <Icon fontSize="large">keyboard_arrow_right</Icon>
              </div>
            </Link>
          </div>
        </div>

        {/* ============= FOOTER SECTION ============= */}
        <Footer />
      </div>
    )
  }
}

Profile.propTypes = {
  bio: PropTypes.string,
  name: PropTypes.string
}

export default Profile
