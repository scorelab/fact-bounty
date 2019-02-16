const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

// Create Schema
const StorySchema = new Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	featured_img_url: {
		type: String,
		required: true
	},
	upvote_count: {
		type: Number,
		required: true
	},
	downvote_count: {
		type: Number,
		required: true
	},
	date_added: {
		type: Date,
		default: Date.now
	}
})

StorySchema.plugin(mongoosePaginate)

module.exports = mongoose.model('stories', StorySchema)
