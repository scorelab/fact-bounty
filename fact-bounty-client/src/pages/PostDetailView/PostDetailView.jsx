import React, { Component } from 'react'
import VotesBar from '../../components/VotesBar'
import placeholder from '../../assets/img/placeholder.png'
import './style.sass'

class PostDetailView extends Component {
  render() {
    const { match } = this.props
    console.log(match)
    return (
      <div className="container post-detail-view-wrapper">
        <div className="header">
          <div>
            <h1>{match.params.id}</h1>
            <p>Date: 01/07/1999</p>
          </div>
          <h5>5 Votes</h5>
        </div>
        <div className="votes-bar-section">
          <VotesBar
            approved_count={50}
            mixedvote_count={25}
            fake_count={25}
          />
        </div>
        <div className="image">
          <img src={placeholder} alt="fact-bounty" className="post-img"/>
        </div>
        <div className="content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel 
          mattis lacus. VivamusLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus 
          non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. VivamusLorem ipsum dolor sit amLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. 
          Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. VivamusLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim 
          lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. VivamusLorem ipsum dolor sit amet, 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel 
          mattis lacus. VivamusLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus 
          non dignissim lectus, vel mattis lacus. Vivamusconsectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non 
          dignissim lectus, vel mattis lacus. Vivamuset, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. VivamusLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor 
          sit amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamusconsectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus. Lorem ipsum dolor sit 
          amet, consectetur adipiscing elit. Vivamus non dignissim lectus, vel mattis lacus. Vivamus.</p>
        </div>
      </div>
    )
  }
}

PostDetailView.propTypes = {}

export default PostDetailView
