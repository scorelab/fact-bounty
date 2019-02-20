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
	approved_count: {
		type: Number,
		required: true
	},
	fake_count: {
		type: Number,
		required: true
	},
	mixedvote_count: {
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
