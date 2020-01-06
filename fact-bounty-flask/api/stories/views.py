from flask import Blueprint
from .controller import storyController

storyprint = Blueprint("stories", __name__)


storyprint.add_url_rule(
    "/all", view_func=storyController["allstories"], methods=["GET"]
)

storyprint.add_url_rule(
    "/get-range/<int:page>",
    view_func=storyController["getrange"],
    methods=["GET"],
)

storyprint.add_url_rule(
    "/get/<string:id>", view_func=storyController["getstory"], methods=["GET"]
)

storyprint.add_url_rule(
    "/search/<string:keyword>",
    view_func=storyController["search"],
    methods=["GET"],
)

storyprint.add_url_rule(
    "/load-user-votes",
    view_func=storyController["loaduservotes"],
    methods=["POST"],
)

storyprint.add_url_rule(
    "/change-vote-count",
    view_func=storyController["changevote"],
    methods=["POST"],
)

storyprint.add_url_rule(
    "/stories/load-user-comments",
    view_func=storyController["loadusercomments"],
    methods=["POST"],
)

storyprint.add_url_rule(
    "/stories/change-comment",
    view_func=storyController["changecomment"],
    methods=["POST"],
)

storyprint.add_url_rule(
    "/stories/delete-comment",
    view_func=storyController["deletecomment"],
    methods=["DELETE"],
)

