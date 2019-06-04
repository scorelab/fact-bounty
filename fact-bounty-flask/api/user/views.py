from flask import Blueprint
from .controller import userController

blueprint = Blueprint('api', __name__)

blueprint.add_url_rule(
    '/users/login',
    view_func=userController['login'],
    methods=['POST']
)

blueprint.add_url_rule(
    '/users/register',
    view_func=userController['register'],
    methods=['POST']
)

blueprint.add_url_rule(
    '/users/oauth',
    view_func=userController['auth'],
    methods=['POST']
)
