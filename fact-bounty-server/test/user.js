
var expect = require('chai').expect
var mongoose = require('mongoose')
var User = require('../models/user')
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')

const info={
	name:'name',
	email:'email@gmail.com',
	password:'password',
	password2:'password'
}

chai.use(chaiHttp)

describe('Authentication tests', async () => {
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

	after( async () => {
		await User.deleteOne({
			'email': info.email
		})
			.exec(function(err){
				if(err){
					console.log(err)
				}
				process.exit(0)
			})
	})

	it('User Register', (done) => {
		chai.request(server)
			.post('/api/users/register')
			.send(info)
			.end((err, data) => {
				if(data){
					expect(data).to.have.an('object')
					expect(data).to.not.have.property('password2','Passwords must match')
					expect(data).to.not.have.property('emailnotfound','Email not found')
					expect(data).to.not.have.property('email','Email already exists')
					done()
				}
			})
	})

	it('User Login', (done) => {
		chai.request(server)
			.post('/api/users/login')
			.send({
				email:info.email,
				password:info.password
			})
			.end((err, data) => {
				if(data.body){
					expect(data.body).to.be.an('object')
					expect(data.body).to.not.have.property('emailnotfound')
					expect(data.body).to.have.property('success',true)
					expect(data.body).to.have.property('token')
					done()
				}
			})
	})
})





