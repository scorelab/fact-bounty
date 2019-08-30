import { FETCH_TWEETS, LOADING_TWEETS } from './actionTypes'
import Twitter from '../../helpers/twitter'

export const fetchTweets = (limit, user) => dispatch => {
  dispatch({
    type: LOADING_TWEETS
  })
  const twitter = Twitter()
  twitter
    .getUserTweets(limit, user)
    .then(tweets => {
      let tweetItems = []
      tweets.map(tweet => {
        const item = {
          content: tweet.text,
          date: tweet.created_at,
          title: tweet.user.name,
          _id: tweet.id_str,
          approved_count: 0,
          mixedvote_count: 0,
          fake_count: 0,
          user: tweet.user.screen_name
        }
        tweetItems.push(item)
      })
      dispatch({
        type: FETCH_TWEETS,
        payload: tweetItems,
        user: user
      })
    })
    .catch(err => {
      console.error('Invalid response:', err)
    })
}
