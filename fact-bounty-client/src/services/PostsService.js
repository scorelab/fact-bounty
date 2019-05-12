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
 * POST : fetchPosts
 *
 */
const approveVote = (story_id, change_val) => {
  return ApiBuilder.API.post(`/api/stories/change-upvote-count`, {
    story_id,
    change_val
  })
}

/**
 *
 * POST : fakeVote
 *
 */
const fakeVote = (story_id, change_val) => {
  return ApiBuilder.API.post(`/api/stories/change-downvote-count`, {
    story_id,
    change_val
  })
}

/**
 *
 * POST : mixVote
 *
 */
const mixVote = (story_id, change_val) => {
  return ApiBuilder.API.post(`/api/stories/change-mixedvote-count`, {
    story_id,
    change_val
  })
}

export default {
  fetchPosts,
  approveVote,
  fakeVote,
  mixVote
}
