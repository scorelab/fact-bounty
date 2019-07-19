import axios from 'axios'
import {
  FETCH_POSTS,
  LOADING,
  VOTE_COMPLETE,
  VOTE_ERROR,
  INCREMENT_PAGE,
  FETCH_POST_BY_ID
} from './actionTypes'
import PostsService from '../../services/PostsService'

export const fetchPosts = page => dispatch => {
  dispatch({ type: LOADING })
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
  dispatch({ type: LOADING })
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

export const changeVoteCount = (story_id, vote_value) => dispatch => {
  PostsService.changeVoteCount(story_id, vote_value)
    .then(res => {
      console.log(res)
      // dispatch({
      //   type: VOTE_COMPLETE
      // })
    })
    .catch(err => {
      console.error('Server response invalid:', err)
    })
}

export const loadUserVotes = user_id => dispatch => {
  PostsService.loadUserVotes()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}
