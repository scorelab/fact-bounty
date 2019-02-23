const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

// Load input validation
const validateRegisterInput = require('../validation/register')
const validateLoginInput = require('../validation/login')

// Load User model
const User = require('../models/user')

// @desc Register user
// @access Public
exports.userRegister = function (req, res, next) {
	// Form validation
	const { errors, isValid } = validateRegisterInput(req.body)

	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ email: 'Email already exists' })
		}
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})
		newUser.save().then(user => res.json(user)).catch(err => console.log(err))
	})
}



// @desc Login user and return JWT token
// @access Public
exports.userLogin = function (req, res, next) {
	// Form validation
	const { errors, isValid } = validateLoginInput(req.body)

	// Check validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const email = req.body.email
	const password = req.body.password

	// Find user by email
	User.findOne({ email }).then(user => {
		// Check if user exists
		if (!user) {
			return res.status(404).json({ emailnotfound: 'Email not found' })
		}

		user.comparePassword(password, function (err, isMatch) {
			if (isMatch && !err) {
				// User matched
				// Create JWT Payload
				const payload = {
					id: user.id,
					name: user.name
				}

				// Sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{
						expiresIn: 31556926 // 1 year in seconds
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						})
					}
				)
			} else {
				return res
					.status(401)
					.json({ passwordincorrect: 'Password incorrect' })
			}
		})
	})
}

