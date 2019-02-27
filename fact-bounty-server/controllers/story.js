const Story = require('../models/story')

// @desc Get all stories
// @access Public
exports.storyAll = function (req, res, next) {
	Story.find({}).then(posts => {
		return res.status(200).json(posts)
	})
}

// @desc Get stories in a range
// @access Public
exports.storyRange = function (req, res, next) {
	const options = {
		page: req.params.page,
		limit: 7
	}
	Story.paginate({}, options, function (err, result) {
		return res.status(200).json(result)
	})
}


// @desc Change upvote count of a story
// @access Public
exports.storyChangeUpvoteCount = function (req, res, next) {
	Story.updateOne({ _id: req.body.story_id }, {
		$inc: {
			approved_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
}

// @desc Change downvote count of a story
// @access Public
exports.storyChangeDownvoteCount = function (req, res, next) {
	Story.updateOne({ _id: req.body.story_id }, {
		$inc: {
			fake_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
}

// @desc Change mixedvote count of a story
// @access Public
exports.storyChangeMixedvoteCount = function (req, res, next) {
	Story.updateOne({ _id: req.body.story_id }, {
		$inc: {
			mixedvote_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
}