from flask import Blueprint
from .controller import adminController

adminprint = Blueprint("admin", __name__)

adminprint.add_url_rule(
    "/system", view_func=adminController["system"], methods=["GET"]
)
