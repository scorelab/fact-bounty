var express =  require('express')

const router = express.Router()

const storyController = require('../../controllers/story') 

router.get(
  '/all', 
  storyController.storyAll)

router.get(
  '/get-range/:page', 
  storyController.storyRange)

router.post(
  '/change-upvote-count', 
  storyController.storyChangeUpvoteCount)

router.post(
  '/change-downvote-count', 
  storyController.storyChangeDownvoteCount)

router.post(
  '/change-mixedvote-count', 
  storyController.storyChangeDownvoteCount)

module.exports = router