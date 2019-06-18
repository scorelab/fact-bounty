import React, { Component } from 'react'
import headerImg from '../../assets/img/headerImg.png'
import Button from '@material-ui/core/Button'
import Footer from '../../components/Footer'
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
        {/* ============= HEADER SECTION ============= */}
        <div className="container">
          <div className="header">
            <div className="row">
              <div className="col-md left-section">
                <h1>Welcome to Fact Bounty</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                <Button variant="contained" color="primary" style={{ width: 120 }}>
                  EXPLORE
              </Button>
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
            <h1>About Factbounty</h1>

            <div className="row">
              <div className="col-md">
                <div className="about-block">
                  <label>1</label>AWESOME FEATURE
                  <h3>Lorem ipsum dolor</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim.</p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block">
                  <label>1</label>AWESOME FEATURE
                  <h3>Lorem ipsum dolor</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim.</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md">
                <div className="about-block">
                  <label>1</label>AWESOME FEATURE
                  <h3>Lorem ipsum dolor</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim.</p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block">
                  <label>1</label>AWESOME FEATURE
                  <h3>Lorem ipsum dolor</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus non dignissim.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============= RECENT POSTS SECTION ============= */}
        <div className="container" id="recentPosts">
          <div className="recent-posts">
            <h1>Recent Posts</h1>
          </div>
        </div>

        {/* ============= CONTACT US SECTION ============= */}
        <div className="container" id="contact">
          <div className="contact-us">
            <h1>Contact Us</h1>
          </div>
        </div>

        {/* ============= FOOTER SECTION ============= */}
        <Footer />
      </div>
    )
  }
}

export default Landing
