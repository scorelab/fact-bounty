from flask.views import MethodView
from flask import make_response, request, jsonify, current_app

class AllStories(MethodView):
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """
    def get(self):
        search = current_app.elasticsearch.search(
            index='contents', doc_type='contents', body={
                'query': {'multi_batch': {'query': '', 'fields': ['*']}}
            }
        )
        stories = search['hits']['hits']

        response = {
            'message': 'Stories successfully fetched',
            'stories': [story.to_json() for story in stories]
        } 
        return make_response(jsonify(response)), 200


class GetRange(MethodView):
    """
    Retrieve stories in range
    
    :return: JSON object with range of stories and HTTP status code 200.
    """
    def get(self, page):
        search = current_app.elasticsearch.search(
            index='contents', doc_type='contents', body={
                'query': {'multi_batch': {'query': [], 'fields': ['*']}},
                'from': (page - 1) * current_app.config['POSTS_PER_PAGE'], 'size': current_app.config['POSTS_PER_PAGE']
            }
        )
        stories = search['hits']['hits']

        response = {
            'message': 'Stories successfully fetched',
            'stories': [story.to_json() for story in stories]
        } 
        return make_response(jsonify(response)), 200


class ChangeUpvote(MethodView):
    """
    Update upvote-count
    
    :param request: the request being processed
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = current_app.elasticsearch.update(
            index='contents', doc_type='contents', id=_id, body={
                "doc": {"approved_count": (hit.meta.doc.approved_count + value)}
            }
        )
        response = {
            'message': 'Changed upvote successfully'
        } 
        return make_response(jsonify(response)), 200


class ChangeDownvote(MethodView):
    """
    Update fake-count
    
    :param request: the request being processed
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = current_app.elasticsearch.update(
            index='contents', doc_type='contents', id=_id, body={
                "doc": {"fake_count": (hit.meta.doc.fake_count + value)}
            }
        )
        response = {
            'message': 'Changed downvote successfully'
        } 
        return make_response(jsonify(response)), 200


class ChangeMixvote(MethodView):
    """
    Update mixedvote-count
    
    :param request: the request being processed
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = current_app.elasticsearch.update(
            index='contents', doc_type='contents', id=_id, body={
                "doc": {"mixedvote_count": (hit.meta.doc.mixedvote_count + value)}
            }
        )
        response = {
            'message': 'Changed mixedvote successfully'
        } 
        return make_response(jsonify(response)), 200


storyController = {
    'allstories': AllStories.as_view('all_stories'),
    'getrange': GetRange.as_view('get_range'),
    'changedownvote': ChangeDownvote.as_view('change_downvote'),
    'changemixvote': ChangeMixvote.as_view('change_mixvote'),
    'changeupvote': ChangeUpvote.as_view('change_upvote')
}