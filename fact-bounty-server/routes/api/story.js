const Story = require('../../models/story')

// @desc Get all stories
// @access Public
exports.storyAll = function (res, req) {
	Story.find({}).then(posts => {
		return res.status(200).json(posts)
	})
}

// @desc Get stories in a range
// @access Public
exports.storyRange = function (res, req) {
	const options = {
		page: req.params.page,
		limit: 3
	}
	Story.paginate({}, options, function (err, result) {
		return res.status(200).json(result)
	})
}


// @desc Change upvote count of a story
// @access Public
exports.storyChangeUpvoteCount = function (res, req) {
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
exports.storyChangeDownvoteCount = function (res, req) {
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
exports.storyChangeMixedvoteCount = function (res, req) {
	Story.updateOne({ _id: req.body.story_id }, {
		$inc: {
			mixedvote_count: req.body.change_val
		}
	}, function (mon_err, affected, mon_res) {
		return mon_err ? res.status(200).json(mon_err) : res.status(200).send()
	})
}