var express = require('express')
var router = express.Router()

// API's path
var storyRoute = require('./api/story')
var usersRoute = require('./api/user')

// Routes
// -> /api/stories/
router.use('/api/stories', storyRoute)

// -> /api/users/
router.use('/api/users', usersRoute)

module.exports = router