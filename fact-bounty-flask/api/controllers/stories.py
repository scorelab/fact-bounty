from flask.views import MethodView
from flask import make_response, request, jsonify, current_app
from ..models.story import Story

class AllStories(MethodView):
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """
    def get(self):
        stories = Story.query.all()
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
        pagination = Story.query.paginate(
            page, per_page=current_app.config['POSTS_PER_PAGE'], error_out=False
        )
        stories = pagination.items

        response = {
            'message': 'Stories successfully fetched',
            'stories': [story.to_json() for story in stories]
        } 
        return make_response(jsonify(response)), 200


class ChangeUpvote(MethodView):
    """
    Update upvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = Story.query.filter_by(id=_id).first()
        if story is None:
            return jsonify({
                'response': 'No story with given id'
            }), 404
        story.approved_count += int(value)
        story.save()
        response = {
            'message': 'Changed upvote successfully',
            'story': story.to_json()
        } 
        return make_response(jsonify(response)), 200


class ChangeDownvote(MethodView):
    """
    Update fake-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = Story.query.filter_by(id=_id).first()
        if story is None:
            return jsonify({
                'response': 'No story with given id'
            }), 404
        story.fake_count += int(value)
        story.save()
        response = {
            'message': 'Changed upvote successfully',
            'story': story.to_json()
        } 
        return make_response(jsonify(response)), 200


class ChangeMixvote(MethodView):
    """
    Update mixedvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    def post(self):
        data = request.get_json(silent=True)
        _id = data['story_id']
        value = data['change_val']
        story = Story.query.filter_by(id=_id).first()
        if story is None:
            return jsonify({
                'response': 'No story with given id'
            }), 404
        story.mixedvote_count += int(value)
        story.save()
        response = {
            'message': 'Changed upvote successfully',
            'story': story.to_json()
        } 
        return make_response(jsonify(response)), 200


storyController = {
    'allstories': AllStories.as_view('all_stories'),
    'getrange': GetRange.as_view('get_range'),
    'changedownvote': ChangeDownvote.as_view('change_downvote'),
    'changemixvote': ChangeMixvote.as_view('change_mixvote'),
    'changeupvote': ChangeUpvote.as_view('change_upvote')
}