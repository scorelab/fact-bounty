from flask import Blueprint
from .controller import storyController

blueprint = Blueprint('api', __name__)


blueprint.add_url_rule(
    '/stories/all',
    view_func=storyController['allstories'],
    methods=['GET']
)

blueprint.add_url_rule(
    '/stories/get-range/<int:page>',
    view_func=storyController['getrange'],
    methods=['GET']
)

blueprint.add_url_rule(
    '/stories/change-upvote-count',
    view_func=storyController['changeupvote'],
    methods=['POST']
)

blueprint.add_url_rule(
    '/stories/change-downvote-count',
    view_func=storyController['changedownvote'],
    methods=['POST']
)
blueprint.add_url_rule(
    '/stories/change-mixedvote-count',
    view_func=storyController['changemixvote'],
    methods=['POST']
)

blueprint.add_url_rule(
    '/stories/load-user-votes',
    view_func=storyController['loaduservotes'],
    methods=['POST']
)