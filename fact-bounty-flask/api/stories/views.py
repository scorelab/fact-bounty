from flask import Blueprint
from .controller import storyController

storyprint = Blueprint('stories', __name__)


storyprint.add_url_rule(
    '/stories/all',
    view_func=storyController['allstories'],
    methods=['GET']
)

storyprint.add_url_rule(
    '/stories/get-range/<int:page>',
    view_func=storyController['getrange'],
    methods=['GET']
)

storyprint.add_url_rule(
    '/stories/change-upvote-count',
    view_func=storyController['changeupvote'],
    methods=['POST']
)

storyprint.add_url_rule(
    '/stories/change-downvote-count',
    view_func=storyController['changedownvote'],
    methods=['POST']
)
storyprint.add_url_rule(
    '/stories/change-mixedvote-count',
    view_func=storyController['changemixvote'],
    methods=['POST']
)

storyprint.add_url_rule(
    '/stories/load-user-votes',
    view_func=storyController['loaduservotes'],
    methods=['POST']
)