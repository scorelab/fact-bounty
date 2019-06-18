import React, { Component } from 'react'
import headerImg from '../../assets/img/headerImg.png'
import Button from '@material-ui/core/Button'
import './style.sass'

class Landing extends Component {
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

        {/* ============= HEADER SECTION ============= */}
        <div className="container">
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
      </div>
    )
  }
}

export default Landing
