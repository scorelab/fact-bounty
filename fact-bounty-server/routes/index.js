var express = require('express')
var router = express.Router()

// API's path
var stories = require('./api/story')
var users = require('./api/user')

// Routes
// -> /api/stories/
router.get('/api/stories/all', stories.storyAll)
router.get('/api/stories/get-range/:page', stories.storyRange)
router.post('/api/stories/change-upvote-count', stories.storyChangeUpvoteCount)
router.post('/api/stories/change-downvote-count', stories.storyChangeDownvoteCount)
router.post('/api/stories/change-mixedvote-count', stories.storyChangeDownvoteCount)

// -> /api/users/
router.post('/api/users/register', users.userRegister)
router.post('/api/users/login', users.userLogin)

module.exports = router