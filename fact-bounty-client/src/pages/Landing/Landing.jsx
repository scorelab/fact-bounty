import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import headerImg from '../../assets/img/headerImg.png'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Footer from '../../components/Footer'
import patch2 from '../../assets/img/patch2.png'
import patch3 from '../../assets/img/patch3.png'
import PostsList from '../../components/PostsList'
import ContactUsForm from '../../components/ContactUsForm'
import './style.sass'
import TweetList from '../../components/TweetList/TweetList'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@material-ui/core/Typography'
// import Box from '@material-ui/core/Box'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {children}
    </Typography>
  )
}
class Landing extends Component {
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
        {/* ============= HEADER SECTION ============= */}
        <div className="container">
          <div className="header">
            <div className="row">
              <div className="col-md left-section">
                <h1>
                  Welcome to <b>Fact Bounty</b>
                </h1>
                <p>
                  Fact Bounty is a crowdsourced based fact-checking platform. Using Fact Bounty, you will be able to find out the truth and minimize the spread of false news and rumors.
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

        {/* ============= RECENT TWEETS SECTION ============= */}
        {/* <div className="container" id="recentPosts">
          <div className="recent-posts">
            <h1>Recent Tweets</h1>
            <TweetList limit={4} user={'adaderana'} />
          </div>
        </div> */}
        <div className="container">
          <h1>Recent Tweets</h1>
          <Paper>
            <Tabs
              value={value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Ada Derana" />
              <Tab label="lanka C news" />
              <Tab label="විගස පුවත් 24x7" />
              <Tab label="Mawbima" />
            </Tabs>
          </Paper>
        </div>
        <div className="tab-container">
          <SwipeableViews
            // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabPanel value={value} index={0}>
              <div className="container">
                <TweetList limit={4} user={'adaderana'} />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className="container">
                <TweetList limit={4} user={'lankacnews'} />
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className="container">
                <TweetList limit={4} user={'vigasapuwath'} />
              </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <div className="container">
                <TweetList limit={4} user={'mawbimaonline'} />
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
        <div className="container">
          <div>
            <Link to="/tweets">
              <div className="view-all-btn">
                <label>View All</label>
                <Icon fontSize="large">keyboard_arrow_right</Icon>
              </div>
            </Link>
          </div>
        </div>

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
                    Search for news posts in Fact Bounty and find out which posts are real and which are fake.
                  </p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block">
                  <label>2</label>VOTE
                  <h3>Vote News Posts</h3>
                  <p>
                    Users can upvote, downvote, or put a neutral vote to new posts listed in fact bounty, which will be used to validate the facts stated in the news.
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
                    View charts and graphs to see visual representations of rumor spread and news source validity.
                  </p>
                </div>
              </div>
              <div className="col-md">
                <div className="about-block" />
              </div>
            </div>
          </div>
        </div>

        {/* ============= CONTACT US SECTION ============= */}
        <div className="container" id="contact">
          <ContactUsForm />
        </div>

        {/* ============= FOOTER SECTION ============= */}
        <Footer />
      </div>
    )
  }
}

export default Landing
