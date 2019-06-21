from flask import Blueprint
from .controller import utilController

utilprint = Blueprint('util', __name__)

utilprint.add_url_rule(
    '/contact_us',
    view_func=utilController['contact_us'],
    methods=['POST']
)
