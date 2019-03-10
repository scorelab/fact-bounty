from flask.views import MethodView
from flask import make_response, request, jsonify
from ..models.user import User

class Register(MethodView):
	"""This class registers a new user."""

	def post(self):
		"""Handle POST request for this view. Url --> /api/users/register"""

		user = User.query.filter_by(email=request.form['email']).first()

		if not user:
			# There is no user so we'll try to register them
			try:
				post_data = request.get_json(silent=True)
				# Register the user
				name = post_data['name']
				email = post_data['email']
				password = post_data['password']
				password2 = post_data['password2']
				if (password != password2):
					response = {
						'message': 'Both passwords does not match'
					}
					return make_response(jsonify(response)), 401

				user = User(email=email, password=password, name=name)
				user.save()				
				response = {
					'message': 'You registered successfully. Please log in.'
				}
				# return a response notifying the user that they registered successfully
				return make_response(jsonify(response)), 201
			except Exception as e:
				# An error occured, therefore return a string message containing the error
				response = {
					'message': str(e)
				}
				return make_response(jsonify(response)), 401
		else:
			# There is an existing user. We don't want to register users twice
			# Return a message to the user telling them that they they already exist
			response = {
			    'message': 'User already exists. Please login.'
			}
			return make_response(jsonify(response)), 202

class Login(MethodView):
	"""This class-based view handles user login and access token generation."""

	def post(self):
		"""Handle POST request for this view. Url ---> /api/users/login"""
		try:
			data = request.get_json(silent=True)
			# Get the user object using their email (unique to every user)
			user = User.query.filter_by(email=data['email']).first()
			# Try to authenticate the found user using their password
			if user and user.verify_password(data['password']):
				# Generate the access token. This will be used as the authorization header
				access_token = user.generate_auth_token(user_id=user.id, expiration=3600)
				if access_token:
					response = {
						'message': 'You logged in successfully.',
						'access_token': access_token.decode()
					}
					return make_response(jsonify(response)), 200
			else:
				# User does not exist. Therefore, we return an error message
				response = {
					'message': 'Invalid email or password, Please try again'
				}
				return make_response(jsonify(response)), 401

		except Exception as e:
			# Create a response containing an string error message
			response = {
				'message': str(e)
			}
			# Return a server error using the HTTP Error Code 500 (Internal Server Error)
			return make_response(jsonify(response)), 500

userController = {
	'register': Register.as_view('register'),
	'login': Login.as_view('login')
}