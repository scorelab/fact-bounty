const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/user')
const stories = require('./routes/api/story')

const app = express()

// Bodyparser middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
	.then(() => console.log('MongoDB successfully connected'))
	.catch(err => console.log(err))

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

// Routes
app.use('/api/users', users)
app.use('/api/stories', stories)

const port = process.env.PORT || 7000
app.listen(port, () => console.log(`Server up and running on port ${port} !`))
