from . import api
from .controllers.users import userController
from .controllers.stories import storyController
api.add_url_rule(
    '/users/login',
    view_func=userController['login'],
    methods=['POST']
)

api.add_url_rule(
    '/users/register',
    view_func=userController['register'],
    methods=['POST']
)

api.add_url_rule(
    '/users/oauth',
    view_func=userController['auth'],
    methods=['POST']
)

api.add_url_rule(
    '/stories/all',
    view_func=storyController['allstories'],
    methods=['GET']
)

api.add_url_rule(
    '/stories/get-range/<int:page>',
    view_func=storyController['getrange'],
    methods=['GET']
)

api.add_url_rule(
    '/stories/change-upvote-count',
    view_func=storyController['changeupvote'],
    methods=['POST']
)

api.add_url_rule(
    '/stories/change-downvote-count',
    view_func=storyController['changedownvote'],
    methods=['POST']
)
api.add_url_rule(
    '/stories/change-mixedvote-count',
    view_func=storyController['changemixvote'],
    methods=['POST']
)