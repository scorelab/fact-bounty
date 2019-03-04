from . import api_es as api
from .controllers.story import storyController

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