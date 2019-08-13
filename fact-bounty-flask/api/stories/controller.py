from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import make_response, request, jsonify, current_app
from elasticsearch.helpers import scan
from .model import Vote


class AllStories(MethodView):
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """

    def get(self):

        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        doc = {
            "sort": [{"date": {"order": "desc"}}],
            "query": {"match_all": {}},
        }
        stories = {}
        try:
            for story in scan(es, doc, index=es_index, doc_type="story"):
                PID = story["_id"]
                source = story["_source"]
                stories[PID] = source
        except Exception as e:
            # An error occured, so return a string message containing error
            response = {"message": str(e)}
            return make_response(jsonify(response)), 500

        response = {
            "message": "Stories successfully fetched",
            "stories": stories,
        }
        return make_response(jsonify(response)), 200


class GetRange(MethodView):
    """
    Retrieve stories in range

    :return: JSON object with range of stories and HTTP status code 200.
    """

    def get(self, page):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        stories = []
        try:
            search = es.search(
                index=es_index,
                doc_type="story",
                body={
                    "sort": [{"date": {"order": "desc"}}],
                    "query": {"match_all": {}},
                    "from": (page - 1) * current_app.config["POSTS_PER_PAGE"],
                    "size": current_app.config["POSTS_PER_PAGE"],
                },
            )
            for story in search["hits"]["hits"]:
                PID = story["_id"]
                source = story["_source"]
                source["_id"] = PID
                stories.append(source)
        except Exception as e:
            # An error occured, so return a string message containing error
            response = {"message": str(e)}
            return make_response(jsonify(response)), 500

        response = {
            "message": "Stories successfully fetched",
            "stories": stories,
        }
        return make_response(jsonify(response)), 200


class LoadUserVotes(MethodView):
    # Retrieve user voted posts
    @jwt_required
    def post(self):
        # extract user id from token
        user_id = get_jwt_identity()

        votes = []
        try:
            votes_q = Vote.fetch_user_votes(user_id)
            for vote in votes_q:
                votes.append({"story_id": vote.story_id, "value": vote.value})
        except Exception:
            response = {"message": "Something went wrong!"}
            return make_response(jsonify(response)), 500

        response = {
            "message": "Retrieved user votes successfully",
            "user_votes": votes,
        }
        return make_response(jsonify(response)), 200


class ChangeUserVote(MethodView):
    """
    Update vote-count

    :param request: the request being processed
    """

    @jwt_required
    def post(self):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        # extract user id from token
        user_id = get_jwt_identity()

        # extract data from request
        data = request.get_json(silent=True)

        try:
            _id = data["story_id"]
            vote_value = int(data["vote_value"])
        except Exception:
            response = {"message": "Please provide all the required fields."}
            return make_response(jsonify(response)), 404

        vote_possible_values = [1, -1, 0]
        if vote_value not in vote_possible_values:
            response = {
                "message": "Please provide correct value of field vote_value."
            }
            return make_response(jsonify(response)), 404

        # extract story with given id
        try:
            story = es.get(index=es_index, doc_type="story", id=_id)["_source"]
            approved_count = int(story["approved_count"])
            fake_count = int(story["fake_count"])
            mixedvote_count = int(story["mixedvote_count"])
        except Exception:
            response = {"message": "Please provide correct story id."}
            return make_response(jsonify(response)), 404

        # fetch user vote of that story
        try:
            vote = Vote.query.filter_by(story_id=_id, user_id=user_id).first()
        except Exception:
            response = {"message": "Something went wrong!"}
            return make_response(jsonify(response)), 500

        # if user has already casted vote on that story then update it
        if vote is not None:
            prev_value = vote.value

            # update value column of vote
            vote.value = vote_value

            # update vote count of story based on prev_value
            if prev_value == 1:
                approved_count -= 1
            elif prev_value == -1:
                fake_count -= 1
            else:
                mixedvote_count -= 1
            res = "updated"
            code = 201
        # else create a new vote object
        else:
            try:
                vote = Vote(story_id=_id, user_id=user_id, value=vote_value)
            except Exception:
                response = {"message": "Something went wrong!"}
                return make_response(jsonify(response)), 500
            res = "created"
            code = 200

        # update story vote
        if vote_value == 1:
            approved_count += 1
        elif vote_value == -1:
            fake_count += 1
        else:
            mixedvote_count += 1

        # save vote in table and update story vote count
        try:
            # update story vote count
            es.update(
                index=es_index,
                doc_type="story",
                id=_id,
                body={
                    "doc": {
                        "mixedvote_count": mixedvote_count,
                        "approved_count": approved_count,
                        "fake_count": fake_count,
                    }
                },
            )
            # add/update vote
            vote.save()
        except Exception:
            response = {"message": "Something went wrong!"}
            return make_response(jsonify(response)), 500

        response = {"message": "Vote {} successfully.".format(res)}
        return make_response(jsonify(response)), code


class GetById(MethodView):
    def get(self, id):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        # extract story with given id
        try:
            story = es.get(index=es_index, doc_type="story", id=id)["_source"]
        except Exception:
            response = {"message": "Please provide correct story id."}
            return make_response(jsonify(response)), 404

        response = {"message": "Story fetched successfully", "story": story}
        return make_response(jsonify(response)), 200


class SearchStory(MethodView):
    def get(self, keyword):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        body = {
            "sort": [{"date": {"order": "desc"}}],
            "query": {
                "multi_match": {
                    "query": keyword,
                    "fields": ["content", "title"],
                }
            },
        }

        stories = []
        try:
            res = es.search(index=es_index, doc_type="story", body=body)[
                "hits"
            ]["hits"]
        except Exception:
            response = {"message": "Something went wrong!"}
            return make_response(jsonify(response)), 500

        if len(res) == 0:
            response = {"message": "No story with this keyword found!"}
            return make_response(jsonify(response)), 204

        for story in res:
            PID = story["_id"]
            source = story["_source"]
            source["_id"] = PID
            stories.append(source)

        response = {
            "message": "Stories successfully found",
            "stories": stories,
        }
        return make_response(jsonify(response)), 200


storyController = {
    "allstories": AllStories.as_view("all_stories"),
    "getrange": GetRange.as_view("get_range"),
    "search": SearchStory.as_view("search"),
    "loaduservotes": LoadUserVotes.as_view("load_user_votes"),
    "changevote": ChangeUserVote.as_view("change_vote"),
    "getstory": GetById.as_view("get_story"),
}
