import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import headerImg from '../../assets/img/headerImg.png'
import Button from '@material-ui/core/Button'
import Footer from '../../components/Footer'
import patch2 from '../../assets/img/patch2.png'
import patch3 from '../../assets/img/patch3.png'
import './style.sass'

class Landing extends Component {
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

  render() {
    return (
      <div className="landing-container">
        <div className="patch-wrapper-2">
          <img src={patch2} alt="patch" />
        </div>
        <div className="patch-wrapper-3">
          <img src={patch3} alt="patch" />
        </div>
        {/* ============= HEADER SECTION ============= */}
        <div className="container">
          <div className="header">
            <div className="row">
              <div className="col-md left-section">
                <h1>
                  Welcome to <b>Fact Bounty</b>
                </h1>
                <p>
                  Fact Bounty is a crowd sourced based fact checking platform.
                  Using Fact Bounty, you will be able to find out the truth and
                  minimize spread of false news and roumors
                </p>
                <Link to="/#about">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: 120 }}
                  >
                    EXPLORE
                  </Button>
                </Link>
              </div>
              <div className="col-md right-section">
                <img className="header-img" src={headerImg} alt="News" />
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* ============= ABOUT SECTION ============= */}
        <div className="container" id="about">
          <div className="about">
            <h1>About Fact Bounty</h1>

            <div className="row">
              <div className="col-md">
                <div className="about-block">
                  <label>1</label>SEARCH
                  <h3>Search News Posts</h3>
                  <p>
                    Search for news posts in Fact Bounty and find out which
                    posts are real and which is fake
                  </p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block">
                  <label>2</label>VOTE
                  <h3>Vote News Posts</h3>
                  <p>
                    Users can upvote, down vote or put an neutral vote to new
                    posts listed in fact bounty, which will be used to validate
                    the facts stated in the news
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md">
                <div className="about-block">
                  <label>3</label>VISUALIZE
                  <h3>Visualize News Post Stats</h3>
                  <p>
                    View charts and graphs to see in a visual representations of
                    roumor spread and news source validity
                  </p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block" />
              </div>
            </div>
          </div>
        </div>

        {/* ============= RECENT POSTS SECTION ============= */}
        <div className="container" id="recentPosts">
          <div className="recent-posts" />
        </div>

        {/* ============= CONTACT US SECTION ============= */}
        <div className="container" id="contact">
          <div className="contact-us">
            <h1>Contact Us</h1>
            <p>Feel free to contact us for any inquiries or feedback</p>
            <form>
              <input type="text" name="firstname" placeholder="First Name" />
              <input type="text" name="firstname" placeholder="Email" />
              <textarea name="message" rows="5" placeholder="Your Message" />
            </form>
            <Button variant="contained" color="primary" style={{ width: 120 }}>
              SEND
            </Button>
          </div>
        </div>

        {/* ============= FOOTER SECTION ============= */}
        <Footer />
      </div>
    )
  }
}

export default Landing
