from flask import Blueprint
from .controller import userController

userprint = Blueprint('user', __name__)

userprint.add_url_rule(
    '/users/login',
    view_func=userController['login'],
    methods=['POST']
)

userprint.add_url_rule(
    '/users/register',
    view_func=userController['register'],
    methods=['POST']
)

userprint.add_url_rule(
    '/users/oauth',
    view_func=userController['auth'],
    methods=['POST']
)
