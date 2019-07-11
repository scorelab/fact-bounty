from flask.views import MethodView
from flask import make_response, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    jwt_refresh_token_required,
    get_jwt_identity,
    get_raw_jwt,
)
from .model import User, RevokedToken


class Register(MethodView):
    """This class registers a new user."""

    def post(self):
        """Handle POST request for this view. Url --> /api/users/register"""
        # getting JSON data from request
        post_data = request.get_json(silent=True)

        try:
            name = post_data["name"]
            email = post_data["email"]
            password = post_data["password"]
            password2 = post_data["password2"]
        except Exception:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        # Querying the database with requested email
        user = User.find_by_email(email)

        if user:
            # There is an existing user. We don't want to register users twice
            # Return a message to the user telling them that they they already
            # exist
            response = {"message": "User already exists. Please login."}
            return make_response(jsonify(response)), 202

        # There is no user so we'll try to register them

        # If passwords don't match, return error
        if password != password2:
            response = {"message": "Both passwords does not match"}
            return make_response(jsonify(response)), 401

        # Register the user
        try:
            user = User(email=email, password=password, name=name)
            user.save()
        except Exception:
            response = {"message": "Something went wrong!!"}
            return make_response(jsonify(response)), 500

        response = {"message": "You registered successfully. Please log in."}

        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201


class Login(MethodView):
    """This class-based view handles user login and access token generation."""

    def post(self):
        """Handle POST request for this view. Url ---> /api/users/login"""
        data = request.get_json(silent=True)

        try:
            email = data["email"]
            password = data["password"]
        except Exception:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        # Get the user object using their email (unique to every user)
        user = User.find_by_email(email)

        if not user:
            # User does not exist. Therefore, we return an error message
            response = {"message": "Invalid email, Please try again"}
            return make_response(jsonify(response)), 401

        # Try to authenticate the found user using their password
        if not user.verify_password(password):
            response = {"message": "Wrong password, Please try again"}
            return make_response(jsonify(response)), 402

        access_token = create_access_token(identity=user.id, fresh=True)
        refresh_token = create_refresh_token(user.id)

        if not access_token or not refresh_token:
            response = {"message": "Something went wrong!"}
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500

        # Generate the access token. This will be used as the
        # authorization header
        response = {
            "message": "You logged in successfully.",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user_details": user.to_json,
        }
        return make_response(jsonify(response)), 200


class Auth(MethodView):
    """This class-based view handles user register and access token generation \
    via 3rd sources like facebook, google"""

    def post(self):
        # Querying the database with requested email
        data = request.get_json(silent=True)

        try:
            name = data["name"]
            email = data["email"]
            _type = data["type"]
        except Exception:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        user = User.find_by_email(email)

        if not user:
            # There is no user so we'll try to register them
            user = User(email=email, name=name, _type=_type)

            try:
                user.save()
            except Exception:
                # An error occured, therefore return a string message
                # containing the error
                response = {"message": "Something went wrong!"}
                return make_response(jsonify(response)), 500

            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)

            if not access_token:
                response = {"message": "Something went wrong!"}
                # Return a server error using the HTTP Error Code 500 (Internal
                # Server Error)
                return make_response(jsonify(response)), 500

            # Generate the access token. This will be used as the
            # authorization header
            response = {
                "message": "You logged in successfully.",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
            return make_response(jsonify(response)), 201

        else:
            # There is an existing user, Let him login.
            access_token = create_access_token(identity=user.id, fresh=True)
            refresh_token = create_refresh_token(user.id)

            response = {
                "message": "You logged in successfully.",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
            return make_response(jsonify(response)), 202


class LogoutAccess(MethodView):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            response = {"message": "Access token has been revoked"}
            return make_response(jsonify(response)), 200
        except Exception:
            response = {"message": "Something went wrong!"}
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class LogoutRefresh(MethodView):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()["jti"]
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            response = {"message": "Refresh token has been revoked"}
            return make_response(jsonify(response)), 200
        except Exception:
            response = {"message": "Something went wrong!"}
            # Return a server error using the HTTP Error Code 500 (Internal
            # Server Error)
            return make_response(jsonify(response)), 500


class TokenRefresh(MethodView):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user, fresh=False)

        response = {
            "message": "Token refreshed successfully",
            "access_token": access_token,
        }
        return make_response(jsonify(response)), 200


userController = {
    "register": Register.as_view("register"),
    "login": Login.as_view("login"),
    "auth": Auth.as_view("auth"),
    "logout_access": LogoutAccess.as_view("logout_access"),
    "logout_refresh": LogoutRefresh.as_view("logout_refresh"),
    "token_refresh": TokenRefresh.as_view("token_refresh"),
}
