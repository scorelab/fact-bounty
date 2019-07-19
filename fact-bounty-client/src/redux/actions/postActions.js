import {
  FETCH_POSTS,
  LOADING_POSTS,
  VOTE_COMPLETE,
  INCREMENT_PAGE,
  FETCH_POST_BY_ID,
  LOADING_USER_VOTES,
  SET_USER_VOTES,
  UPDATE_USER_VOTES,
  UPDATE_POST_VOTES
} from './actionTypes'
import PostsService from '../../services/PostsService'

export const fetchPosts = page => dispatch => {
  dispatch({ type: LOADING_POSTS })
  PostsService.fetchPosts(page)
    .then(posts => {
      const stories = posts.data ? posts.data.stories : []
      if (stories.length !== 0) {
        dispatch({
          type: FETCH_POSTS,
          payload: stories
        })
        dispatch({ type: INCREMENT_PAGE })
      }
    })
    .catch(err => {
      console.error('Server response invalid:', err)
    })
}

export const fetchPostById = postId => dispatch => {
  dispatch({ type: LOADING_POSTS })
  PostsService.fetchPostById(postId)
    .then(post => {
      dispatch({
        type: FETCH_POST_BY_ID,
        payload: post.data.story
      })
    })
    .catch(err => {
      console.error('Server response invalid:', err)
    })
}

export const changeVoteCount = (story_id, vote_value, userVote) => dispatch => {
  dispatch({
    type: UPDATE_USER_VOTES,
    payload: { story_id, value: vote_value }
  })
  dispatch({
    type: UPDATE_POST_VOTES,
    // NOTE: userVote is required to not allow vote count to increase more than required
    payload: { story_id, value: vote_value, userVote }
  })
  PostsService.changeVoteCount(story_id, vote_value)
    .then(res => {
      console.log(res)
      dispatch({
        type: VOTE_COMPLETE
      })
    })
    .catch(err => {
      console.error('Server response invalid:', err)
    })
}

export const loadUserVotes = () => dispatch => {
  dispatch({ type: LOADING_USER_VOTES })
  PostsService.loadUserVotes()
    .then(res => {
      dispatch({
        type: SET_USER_VOTES,
        payload: res.data.user_votes
      })
    })
    .catch(err => {
      console.error('Server response invalid:', err)
    })
}
