from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_pagedown import PageDown
from flask_sqlalchemy import SQLAlchemy
from flask import jsonify, make_response
from api import user

db = SQLAlchemy()
mail = Mail()
pagedown = PageDown()

login_manager = LoginManager()
login_manager.login_view = "auth.login"
migrate = Migrate()

jwt = JWTManager()


# This method will check if a token is blacklisted, and will be called automatically when blacklist is enabled
@jwt.token_in_blacklist_loader
def check_if_token_is_blacklist(decypted_token):
    jti = decypted_token["jti"]
    return user.model.RevokedToken.is_jti_blacklisted(jti)


# The following callbacks are used for customizing jwt response/error messages.
@jwt.expired_token_loader
def expired_token_callback():
    response = {"message": "The token has expired.", "error": "token_expired"}
    return make_response(jsonify(response)), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    # we have to keep the argument here, since it's passed in by the caller internally
    response = {
        "message": "Signature verification failed.",
        "error": "invalid_token",
    }
    return jsonify(make_response(response)), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    response = {
        "message": "Request does not contain an access token.",
        "error": "authorization_required",
    }
    return jsonify(make_response(response)), 401


@jwt.needs_fresh_token_loader
def token_not_fresh_callback():
    response = {
        "message": "The token is not fresh.",
        "error": "fresh_token_required",
    }
    return jsonify(make_response(response)), 401


@jwt.revoked_token_loader
def revoked_token_callback():
    response = {
        "message": "The token has been revoked.",
        "error": "token_revoked",
    }
    return jsonify(make_response(response)), 401
