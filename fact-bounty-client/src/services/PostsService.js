import ApiBuilder from '../helpers/ApiBuilder'

/**
 *
 * GET : fetchPosts
 *
 */
const fetchPosts = page => {
  return ApiBuilder.API.get(`/api/stories/get-range/${page}`)
}

/**
 *
 * GET : fetchPostById
 *
 */
const fetchPostById = postId => {
  return ApiBuilder.API.get(`/api/stories/get/${postId}`)
}

/**
 *
 * POST : changeVoteCount
 *
 */
const changeVoteCount = (story_id, vote_value) => {
  return ApiBuilder.API.post(`/api/stories/change-vote-count`, {
    story_id,
    vote_value
  })
}

/**
 *
 * POST : loadUserVotes
 *
 */
const loadUserVotes = () => {
  return ApiBuilder.API.post(`/api/stories/load-user-votes`, {})
}

export default {
  fetchPosts,
  fetchPostById,
  changeVoteCount,
  loadUserVotes
}
