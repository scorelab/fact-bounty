from flask import jsonify, request, current_app, url_for
from .. import api
from .models.story import Story

# Routes for stories

# A route to return all of the available stories
@api.route('/stories/all')
def get_all():
    """
    Retrieve stories

    :return: JSON object with all stories and HTTP status code 200.
    """
    stories = Story.query.all()
    return jsonify({'Stories': [stories.to_json() for story in stories]})

# A route to return stories in range
@api.route('/stories/get-range/<int:page>')
def get_page():
    """
    Retrieve stories in range
    
    :return: JSON object with range of stories and HTTP status code 200.
    """
    pagination = Story.query.paginate(
        page, per_page=7, error_out=False
    )
    stories = pagination.items

    return jsonify({
        'stories': [stories.to_json() for story in stories]
    })

# A route to change upvote count of a story
@api.route('/stories/change-upvote-count')
def change_upvote():
    """
    Update upvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    story = Story.query.get_or_404(id)
    story['approved_count'] = approved_count
    db.session.add(story)
    db.session.commit()
    return jsonify(story.to_json())


# A route to change downvote count of a story
@api.route('/stories/change-downvote-count')
def change_upvote():    
    """
    Update downvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    story = Story.query.get_or_404(id)
    story['approved_count'] = approved_count
    db.session.add(story)
    db.session.commit()
    return jsonify(story.to_json())


# A route to change mixedvote count of a story
@api.route('/stories/change-mixedvote-count')
def change_upvote():
    """
    Update mixedvote-count
    
    :param request: the request being processed
    :return: updated JSON object
    """
    id = request.form['story_id']
    story = Story.query.get_or_404(id)
    story['approved_count'] = approved_count
    db.session.add(story)
    db.session.commit()
    return jsonify(story.to_json())
