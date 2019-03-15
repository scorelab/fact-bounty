from flask.views import MethodView
from flask import make_response, request, jsonify, url_for, current_app
from itsdangerous import URLSafeTimedSerializer

from ..models.user import User


class Register(MethodView):
    """This class registers a new user."""

    def post(self):
        """Handle POST request for this view. Url --> /api/users/register"""
        # getting JSON data from request
        post_data = request.get_json(silent=True)

        # Querying the database with requested email
        user = User.query.filter_by(email=post_data['email']).first()

        if not user:
            # There is no user so we'll try to register them
            try:
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
                access_token = user.generate_auth_token(
                    user_id=user.id, user_name=user.name, expiration=3600)
                if access_token:
                    response = {
                        'message': 'You logged in successfully.',
                        'access_token': access_token.decode(),
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


class Auth(MethodView):
    """This class-based view handles user register and access token generation via 3rd sources like facebook, google"""

    def post(self):
        # Querying the database with requested email
        data = request.get_json(silent=True)
        user = User.query.filter_by(email=data['email']).first()

        if not user:
            # There is no user so we'll try to register them
            try:
                # Register the user
                name = data['name']
                email = data['email']
                _type = data['type']
                user = User(email=email, name=name, _type=_type)
                user.save()
                access_token = user.generate_auth_token(
                    user_id=user.id, user_name=user.name, expiration=3600)

                response = {
                    'message': 'You logged in successfully.',
                    'access_token': access_token.decode()
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
            # There is an existing user, Let him login.
            access_token = user.generate_auth_token(
                user_id=user.id, user_name=user.name, expiration=3600)
            response = {
                'message': 'You logged in successfully.',
                'access_token': access_token.decode()
            }
            return make_response(jsonify(response)), 202


class Forget(MethodView):
    def post(self):
        """Handle POST request for this view. Url ---> /api/users/reset"""
        try:
            data = request.get_json(silent=True)
            # Get the user object using their email (unique to every user)
            user = User.query.filter_by(email=data['email']).first()
        except Exception as e:
            # Create a response containing an string error message
            response = {
                'message': str(e)
            }
            # Return a server error using the HTTP Error Code 500 (Internal Server Error)
            return make_response(jsonify(response)), 500

        password_reset_serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])

        url = 'localhost:3000/user/reset/' + password_reset_serializer.dumps(data['email'], salt='password-reset-salt'),

        print(url)
        ## send it to mail


        response = {
            'message': 'Password Reset Requested'
        }
        return make_response(jsonify(response)), 200



class Reset(MethodView):
    def get(self, token):
        try:
            password_reset_serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

            email = password_reset_serializer.loads(token, salt='password-reset-salt', max_age=3600)
        except:
            response = {
                'message': 'The password reset link is invalid or has expired'
            }
            return make_response(jsonify(response)), 404

        
        response = {
            'message': 'Token is valid',
            'email': email
        }
        return make_response(jsonify(response)), 200


class UpdatePassword(MethodView):
    def post(self):
        data = request.get_json(silent=True)

        try:
            password = data['password']
            user = User.query.filter_by(email=data['email']).first()
        except:
            response = {
                'message': 'Invalid request, Please try again'
            }
            return make_response(jsonify(response)), 500
        user.update_password(password)
        user.save()

        response = {
            'message': 'Password updated successfully.'
        }
        
        return make_response(jsonify(response)), 200


userController = {
    'register': Register.as_view('register'),
    'login': Login.as_view('login'),
    'auth': Auth.as_view('auth'),
    'forget': Forget.as_view('forget'),
    'reset': Reset.as_view('reset'),
    'update_password': UpdatePassword.as_view('update_password') 
}
