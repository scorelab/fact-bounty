from __future__ import annotations
from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    jwt_refresh_token_required,
    get_jwt_identity,
    get_raw_jwt,
)
from .model import User, RevokedToken
from flasgger import swag_from
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask.wrappers import Response
from typing import Tuple


class Register(MethodView):
    """This class registers a new user."""

    @swag_from("../../docs/users/register.yml")
    def post(self) -> Tuple[Response, int]:
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

        # Find if a role is present
        try:
            role = post_data["role"]
            user = User(email=email, password=password, name=name, role=role)
            user.save()
        except KeyError:
            # Register the user as non admin
            try:
                user = User(email=email, password=password, name=name)
                user.save()
            except Exception as err:
                print("Error occured: ", err)
                response = {"message": "Something went wrong!!"}
                return make_response(jsonify(response)), 500

        response = {"message": "You registered successfully. Please log in."}

        # return a response notifying the user that they registered
        # successfully
        return make_response(jsonify(response)), 201


class Login(MethodView):
    """This class-based view handles user login and access token generation."""

    @swag_from("../../docs/users/login.yml")
    def post(self) -> Tuple[Response, int]:
        """Handle POST request for this view. Url ---> /api/users/login"""
        data = request.get_json(silent=True)

        try:
            email = data["email"]
            password = data["password"]
        except Exception as err:
            print("Error occured: ", err)
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
            "user_details": user.to_json(),
        }
        return make_response(jsonify(response)), 200


class ForgotPassword(MethodView):
    """This class sends a reset password mail."""

    def post(self) -> Tuple[Response, int]:
        """Handle POST request for this view. Url --> /api/users/forgot_password"""
        # getting JSON data from request
        post_data = request.get_json(silent=True)

        try:
            email = post_data["email"]
        except Exception:
            response = {"message": "Please provide email."}
            return make_response(jsonify(response)), 404

        # Querying the database with requested email
        user = User.find_by_email(email)
        if user:
            verification_token = user.verification_token
            # Body of the email
            mail_content = (
                """Hi,

            You are receiving this because you have requested to reset password for your account.

            Here is you verification token: """
                + verification_token
            )
            # The email addresses and password
            sender_address = current_app.config["MAIL_USERNAME"]
            sender_pass = current_app.config["MAIL_PASSWORD"]
            receiver_address = user.email
            # Setup the MIME
            message = MIMEMultipart()
            message["From"] = sender_address
            message["To"] = receiver_address
            message["Subject"] = "Password reset"
            # The body and the attachments for the mail
            message.attach(MIMEText(mail_content, "plain"))
            # Create SMTP session for sending the mail
            session = smtplib.SMTP(
                current_app.config["MAIL_SERVER"],
                current_app.config["MAIL_PORT"],
            )  # use gmail with port
            session.starttls()  # enable security
            session.login(
                sender_address, sender_pass
            )  # login with mail_id and password
            text = message.as_string()
            session.sendmail(sender_address, receiver_address, text)
            session.quit()
            print("Password reset email sent successfully")

            response = {
                "message": "Verification token has been sent to you on your registered email"
            }

            # return a response notifying the user that a password reset mail has
            # been sent to registered email
            return make_response(jsonify(response)), 200
        else:
            response = {"message": "Email not registered"}
            return make_response(jsonify(response)), 202


class AuthVerificationToken(MethodView):
    """This class verifies token which is being used to reset the password"""

    def post(self) -> Tuple[Response, int]:
        data = request.get_json(silent=True)
        try:
            verification_token = data["verification_token"]
        except Exception:
            response = {"message": "Please provide verification token."}
            return make_response(jsonify(response)), 404

        # since token is unique, find user by its verification token
        # if it exist it means input token is correct
        user = User.find_by_verification_token(verification_token)

        if user:
            response = {"message": "Auth success"}
            return make_response(jsonify(response)), 200
        else:
            response = {"message": "Incorrect, please check again"}
            return make_response(jsonify(response)), 202


class ResetPassword(MethodView):
    """This class is used to change the password"""

    def post(self) -> Tuple[Response, int]:

        data = request.get_json(silent=True)
        try:
            verification_token = data["verificationToken"]
            new_password = data["password"]
            new_password_confirm = data["password2"]
        except Exception:
            response = {"message": "Please provide all required fields."}
            return make_response(jsonify(response)), 202

        # find user by token
        user = User.find_by_verification_token(verification_token)

        # if token is correct
        if user:
            # new password and confirm has to be equal
            if new_password != new_password_confirm:
                response = {
                    "message": "New password and confirm password does not match"
                }
                return make_response(jsonify(response)), 202
            # overwrite old password with new password
            else:
                user.password = user.generate_password_hash(new_password)
                user.save()
                response = {"message": "Password successfully changed"}
                return make_response(jsonify(response)), 200
        else:
            response = {"message": "Unauthorized"}
            return make_response(jsonify(response)), 401


class Auth(MethodView):
    """This class-based view handles user register and access token generation \
    via 3rd sources like facebook, google"""

    @swag_from("../../docs/users/oauth.yml")
    def post(self) -> Tuple[Response, int]:
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
                "user_details": user.to_json()
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
                "user_details": user.to_json()
            }
            return make_response(jsonify(response)), 202


class LogoutAccess(MethodView):
    @jwt_required
    @swag_from("../../docs/users/logout_access.yml")
    def post(self) -> Tuple[Response, int]:
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
    @swag_from("../../docs/users/logout_refresh.yml")
    def post(self) -> Tuple[Response, int]:
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
    @swag_from("../../docs/users/token_refresh.yml")
    def post(self) -> Tuple[Response, int]:
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user, fresh=False)

        response = {
            "message": "Token refreshed successfully",
            "access_token": access_token,
        }
        return make_response(jsonify(response)), 200


class Profile(MethodView):
    """This class-based view handles retrieving and updating the current \
    user's information"""

    @staticmethod
    @jwt_required
    def get(self) -> Tuple[Response, int]:
        current_user = get_jwt_identity()

        response = jsonify(current_user)
        return make_response(response), 200

    @jwt_required
    def post(self) -> Tuple[Response, int]:
        try:
            post_data = request.get_json(silent=True)
            name = post_data["name"]
            email = post_data["email"]
        except Exception:
            response = {"message": "Some user details are missing."}
            return make_response(jsonify(response)), 404

        # Querying the database to get the user to update
        user = User.find_by_email(email)

        if user:
            user = user.update(email=email, name=name)
            user.save()
            response = {"message": "User has been updated."}
            return make_response(jsonify(response)), 204

        else:
            response = {"message": "User not found. Please check your request."}
            return make_response(jsonify(response)), 404


userController = {
    "register": Register.as_view("register"),
    "login": Login.as_view("login"),
    "forgot_password": ForgotPassword.as_view("forgot_password"),
    "auth_verification_token": AuthVerificationToken.as_view(
        "auth_verification_token"
    ),
    "reset_password": ResetPassword.as_view("reset_password"),
    "auth": Auth.as_view("auth"),
    "logout_access": LogoutAccess.as_view("logout_access"),
    "logout_refresh": LogoutRefresh.as_view("logout_refresh"),
    "token_refresh": TokenRefresh.as_view("token_refresh"),
    "profile": Profile.as_view("profile")
}
