process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let story = require('../models/story')


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp)

describe('Story', () => {

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