from flask import Blueprint

api_es = Blueprint('api_es', __name__)

from . import routes
