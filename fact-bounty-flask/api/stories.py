from flask import jsonify, request, current_app, url_for
from . import api
from '../models/story' import Story

@api.route('/stories/all')
def get_all():
  stories = Story.query.all()
  return jsonify({'Stories': [stories.to_json() for story in stories]})

@api.route('/stories/<int:page>')
def get_page():
  pagination = Story.query.paginate(
    page, per_page=7, error_out=False
  )
  stories = pagination.items
  
  return jsonify({
    'stories': [stories.to_json() for story in stories]
  })

@api.route('/stories/change-upvote-count')
def change_upvote():
  id = request.form['story_id']
  story = Story.query.get_or_404(id)
  story['approved_count'] = approved_count
  db.session.add(story)
  db.session.commit()
  return jsonify(story.to_json())

@api.route('/stories/change-downvote-count')
def change_upvote():
  id = request.form['story_id']
  story = Story.query.get_or_404(id)
  story['approved_count'] = approved_count
  db.session.add(story)
  db.session.commit()
  return jsonify(story.to_json())

@api.route('/stories/change-mixedvote-count')
def change_upvote():
  id = request.form['story_id']
  story = Story.query.get_or_404(id)
  story['approved_count'] = approved_count
  db.session.add(story)
  db.session.commit()
  return jsonify(story.to_json())