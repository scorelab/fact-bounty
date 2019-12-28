from flask import Blueprint
from .controller import userController

userprint = Blueprint("user", __name__)

userprint.add_url_rule(
    "/login", view_func=userController["login"], methods=["POST"]
)

userprint.add_url_rule(
    "/register", view_func=userController["register"], methods=["POST"]
)

userprint.add_url_rule(
    "/oauth", view_func=userController["auth"], methods=["POST"]
)

userprint.add_url_rule(
    "/logout_access",
    view_func=userController["logout_access"],
    methods=["POST"],
)

userprint.add_url_rule(
    "/logout_refresh",
    view_func=userController["logout_refresh"],
    methods=["POST"],
)

userprint.add_url_rule(
    "/token_refresh",
    view_func=userController["token_refresh"],
    methods=["POST"],
)

userprint.add_url_rule(
    "/profile",
    view_func=userController["profile"],
    methods=["GET", "POST"]
)
