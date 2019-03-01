process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let story = require('../models/story')


//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

chai.use(chaiHttp)

describe('Story', () => {
	before(function (done) {
		const db_uri = require('../config/travis').mongoURI
		mongoose.connect(db_uri, { useNewUrlParser: true })
			.then(() => console.log('MongoDB successfully connected'))
			.catch(err => console.log(err))
		const db = mongoose.connection
		db.on('error', console.error.bind(console, 'connection error'))
		db.once('open', function() {
			done()
		})
	})

	describe('/GET allStories', () => {
		it('It should GET all stories', (done) => {
			chai.request(server)
				.get('/api/stories/all')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('array')
					done()
				})
		})
	})

	describe('/GET getRange', () => {
		it('It should GET a range of stories', (done) => {
			chai.request(server)
				.get('/api/stories/get-range/1')
				.end((err, res) => {
					res.should.have.status(200)
					done()
				})
		})
	})

})