from flask import jsonify, request, current_app, url_for
from . import api
from .models.story import Story
from .. import db

# Routes for stories

# A route to return all of the available stories
@api.route('/stories/all')
def get_all():
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """
    stories = Story.query.all()
    return jsonify({'Stories': [story.to_json() for story in stories]})

# A route to return stories in range
@api.route('/stories/get-range/<int:page>')
def get_page(page):
    """
    Retrieve stories in range
    
    :return: JSON object with range of stories and HTTP status code 200.
    """
    pagination = Story.query.paginate(
        page, per_page=current_app.config['POSTS_PER_PAGE'], error_out=False
    )
    stories = pagination.items

    return jsonify({
        'stories': [story.to_json() for story in stories]
    })

# A route to change upvote count of a story
@api.route('/stories/change-upvote-count', methods=['POST'])
def change_upvote():
    """
    Update upvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    value = request.form['change_val']
    story = Story.query.filter_by(id=id).first()
    if story is None:
        return jsonify({
            'response': 'No story with given id'
        }), 404
    story.approved_count += int(value)
    db.session.commit()
    return jsonify(story.to_json())


# A route to change downvote count of a story
@api.route('/stories/change-downvote-count', methods=['POST'])
def change_downvote():    
    """
    Update fake-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    value = request.form['change_val']
    story = Story.query.filter_by(id=id).first()
    if story is None:
        return jsonify({
            'response': 'No story with given id'
        }), 404
    story.fake_count += int(value)
    db.session.commit()
    return jsonify(story.to_json())


# A route to change mixedvote count of a story
@api.route('/stories/change-mixedvote-count', methods=['POST'])
def change_mixvote():
    """
    Update mixedvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    value = request.form['change_val']
    story = Story.query.filter_by(id=id).first()
    if story is None:
        return jsonify({
            'response': 'No story with given id'
        }), 404
    story.mixedvote_count += int(value)
    db.session.commit()
    return jsonify(story.to_json())
