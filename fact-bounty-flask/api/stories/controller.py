from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from elasticsearch.helpers import scan


class AllStories(MethodView):
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """

    def get(self):

        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        doc = {"query": {"match_all": {}}}
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


class ChangeUpvote(MethodView):
    """
    Update upvote-count

    :param request: the request being processed
    """

    def post(self):

        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        try:
            # extract data from request
            data = request.get_json(silent=True)
            _id = data["story_id"]
            value = data["change_val"]
            user_id = data["user"]
            vote_id = data["voteId"]
            prev_vote = data["prevVote"]
            prev_value = data["prevValue"]
            # get earlier count of that story
            votes = es.get(index=es_index, doc_type="story", id=_id)["_source"]
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 404
        try:
            approved_count = votes["approved_count"]
            fake_count = votes["fake_count"]
            mixedvote_count = votes["mixedvote_count"]
            if vote_id != -1:
                es.update(
                    index=es_index,
                    doc_type="votes",
                    id=vote_id,
                    body={"doc": {"vote": "approve", "value": value}},
                )

                if prev_vote == "fake" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "approved_count": (approved_count + value),
                                "fake_count": (fake_count - value),
                            }
                        },
                    )

                    approved_count += value
                    fake_count -= value
                elif prev_vote == "mix" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "approved_count": (approved_count + value),
                                "mixedvote_count": (mixedvote_count - value),
                            }
                        },
                    )
                    approved_count += value
                    mixedvote_count -= value
                else:
                    es.update(
                        index="factbounty",
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {"approved_count": (approved_count + value)}
                        },
                    )
                    approved_count += value
            else:
                doc = {
                    "user_id": user_id,
                    "story_id": _id,
                    "vote": "approve",
                    "value": value,
                }
                newVoteID = es.index(
                    index=es_index, doc_type="votes", body=doc
                )["_id"]
                vote_id = newVoteID
                es.update(
                    index=es_index,
                    doc_type="story",
                    id=_id,
                    body={"doc": {"approved_count": (approved_count + value)}},
                )
                approved_count += value
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 500
        response = {
            "message": "Changed upvote successfully",
            "votes": {
                "approved_count": approved_count,
                "fake_count": fake_count,
                "mixedvote_count": mixedvote_count,
            },
            "voteId": vote_id,
        }
        return make_response(jsonify(response)), 200


class ChangeDownvote(MethodView):
    """
    Update fake-count

    :param request: the request being processed
    """

    def post(self):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        try:
            # extract data from request
            data = request.get_json(silent=True)
            _id = data["story_id"]
            value = data["change_val"]
            user_id = data["user"]
            vote_id = data["voteId"]
            prev_vote = data["prevVote"]
            prev_value = data["prevValue"]
            # get earlier count of that story
            votes = es.get(index=es_index, doc_type="story", id=_id)["_source"]
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 404
        try:
            approved_count = votes["approved_count"]
            fake_count = votes["fake_count"]
            mixedvote_count = votes["mixedvote_count"]
            if vote_id != -1:
                es.update(
                    index=es_index,
                    doc_type="votes",
                    id=vote_id,
                    body={"doc": {"vote": "fake", "value": value}},
                )
                if prev_vote == "approve" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "fake_count": (fake_count + value),
                                "approved_count": (approved_count - value),
                            }
                        },
                    )

                    fake_count += value
                    approved_count -= value
                elif prev_vote == "mix" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "fake_count": (fake_count + value),
                                "mixedvote_count": (mixedvote_count - value),
                            }
                        },
                    )

                    fake_count += value
                    mixedvote_count -= value
                else:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={"doc": {"fake_count": (fake_count + value)}},
                    )
                    fake_count += value
            else:
                doc = {
                    "user_id": user_id,
                    "story_id": _id,
                    "vote": "fake",
                    "value": value,
                }
                newVoteID = es.index(
                    index=es_index, doc_type="votes", body=doc
                )["_id"]
                vote_id = newVoteID
                es.update(
                    index=es_index,
                    doc_type="story",
                    id=_id,
                    body={"doc": {"fake_count": (fake_count + value)}},
                )
                fake_count += value
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 500
        response = {
            "message": "Changed upvote successfully",
            "votes": {
                "approved_count": approved_count,
                "fake_count": fake_count,
                "mixedvote_count": mixedvote_count,
            },
            "voteId": vote_id,
        }
        return make_response(jsonify(response)), 200


class ChangeMixvote(MethodView):
    """
    Update mixedvote-count

    :param request: the request being processed
    """

    def post(self):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        try:
            # extract data from request
            data = request.get_json(silent=True)
            _id = data["story_id"]
            value = data["change_val"]
            user_id = data["user"]
            vote_id = data["voteId"]
            prev_vote = data["prevVote"]
            prev_value = data["prevValue"]

            # get earlier count of that story
            votes = es.get(index=es_index, doc_type="story", id=_id)["_source"]
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 404
        try:
            approved_count = votes["approved_count"]
            fake_count = votes["fake_count"]
            mixedvote_count = votes["mixedvote_count"]
            if vote_id != -1:
                es.update(
                    index=es_index,
                    doc_type="votes",
                    id=vote_id,
                    body={"doc": {"vote": "mix", "value": value}},
                )
                if prev_vote == "approve" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "mixedvote_count": (mixedvote_count + value),
                                "approved_count": (approved_count - value),
                            }
                        },
                    )
                    mixedvote_count += value
                    approved_count -= value
                elif prev_vote == "fake" and prev_value == 1:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "mixedvote_count": (mixedvote_count + value),
                                "fake_count": (fake_count - value),
                            }
                        },
                    )
                    mixedvote_count += value
                    fake_count -= value
                else:
                    es.update(
                        index=es_index,
                        doc_type="story",
                        id=_id,
                        body={
                            "doc": {
                                "mixedvote_count": (mixedvote_count + value)
                            }
                        },
                    )
                    mixedvote_count += value
            else:
                doc = {
                    "user_id": user_id,
                    "story_id": _id,
                    "vote": "mix",
                    "value": value,
                }
                newVoteID = es.index(
                    index=es_index, doc_type="votes", body=doc
                )["_id"]
                vote_id = newVoteID
                es.update(
                    index=es_index,
                    doc_type="story",
                    id=_id,
                    body={
                        "doc": {"mixedvote_count": (mixedvote_count + value)}
                    },
                )
                mixedvote_count += value
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response)), 500
        response = {
            "message": "Changed upvote successfully",
            "votes": {
                "approved_count": approved_count,
                "fake_count": fake_count,
                "mixedvote_count": mixedvote_count,
            },
            "voteId": vote_id,
        }
        return make_response(jsonify(response)), 200


class LoadUserVotes(MethodView):
    # Retrieve user voted posts
    def post(self):
        es_index = current_app.config["ES_INDEX"]
        es = current_app.elasticsearch

        votes = []
        try:
            data = request.get_json(silent=True)
            user_id = data["user"]
            search_query = {
                "query": {"bool": {"must": [{"match": {"user_id": user_id}}]}}
            }
            result = es.search(
                index=es_index, doc_type="votes", body=search_query
            )["hits"]
            if result["total"] > 0:
                for user_vote in result["hits"]:
                    element = user_vote["_source"]
                    element["_id"] = user_vote["_id"]
                    votes.append(element)
        except Exception as e:
            response = {"message": str(e)}
            return make_response(jsonify(response))
        response = {
            "message": "Retrieved user votes successfully",
            "user_votes": votes,
        }
        return make_response(jsonify(response)), 200


storyController = {
    "allstories": AllStories.as_view("all_stories"),
    "getrange": GetRange.as_view("get_range"),
    "changedownvote": ChangeDownvote.as_view("change_downvote"),
    "changemixvote": ChangeMixvote.as_view("change_mixvote"),
    "changeupvote": ChangeUpvote.as_view("change_upvote"),
    "loaduservotes": LoadUserVotes.as_view("load_user_votes"),
}
