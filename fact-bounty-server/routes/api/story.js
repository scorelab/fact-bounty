const express = require('express')
const router  = express.Router()

// Load Story model
const Story = require('../../models/Story')

// @route GET api/stories/all
// @desc Get all stories
// @access Public
router.get('/all', (req, res) => {
	Story.find({}).then(posts => {
		return res.status(200).json(posts)
	})
})

// @route GET api/stories/get
// @desc Get stories in a range
// @access Public
router.get('/get-range/:page', (req, res) => {
	const options = {
		page: req.params.page,
		limit: 3
	}

	Story.paginate({}, options, function (err, result) {
		return res.status(200).json(result)
	})
})

// @route POST api/stories/change-approved-count
// @desc Change approved count of a story
// @access Public
router.post('/change-approved-count', (req, res) => {
	Story.updateOne({_id: req.body.story_id}, {
		$inc: {
			approved_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
})

// @route POST api/stories/change-fake-count
// @desc Change fake count of a story
// @access Public
router.post('/change-fake-count', (req, res) => {
	Story.updateOne({_id: req.body.story_id}, {
		$inc: {
			fake_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
})

// @route POST api/stories/change-mixed-count
// @desc Change mixed count of a story
// @access Public
router.post('/change-mixed-count', (req, res) => {
	Story.updateOne({_id: req.body.story_id}, {
		$inc: {
			mixedvote_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
})

module.exports = router
