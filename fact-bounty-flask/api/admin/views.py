from flask import Blueprint
from .controller import adminController

adminprint = Blueprint("admin", __name__)

adminprint.add_url_rule(
    "/system", view_func=adminController["system"], methods=["GET"]
)

adminprint.add_url_rule(
    "/register", view_func=adminController["register"], methods=["POST"]
)

adminprint.add_url_rule(
    "/login", view_func=adminController["login"], methods=["POST"]
)

adminprint.add_url_rule(
    "/logout", view_func=adminController["logout"], methods=['POST']
)   