#!flask/bin/python
from flask import Flask, jsonify
from flask_restful import Api
import json

app = Flask(__name__)

USER_ROUTE = '/api/user'
STORY_ROUTE = '/api/stories'

# add all story routes
@app.route(STORY_ROUTE + '/all', methods=['GET'])
def storyAll():
  with open('stories.json') as f:
    data = json.load(f)
    return jsonify(data)

@app.route(STORY_ROUTE + '/get-range/<int:page>', methods=['GET'])
def storyRange():
  with open('stories.json') as f:
    limit = 7
    data = json.load(f)
    if (page > limit):
      page = limit

    data = data[:page]
    return jsonify(data)

@app.route(STORY_ROUTE + '/change-upvote-count', methods=['POST'])
def storyChangeUpvoteCount():
  return None

@app.route(STORY_ROUTE + '/change-downvote-count', methods=['POST'])
def indstoryChangeDownvoteCount():
  return None

@app.route(STORY_ROUTE + '/change-upvote-count', methods=['POST'])
def storyChangeMixedvoteCount():
  return None


@app.route(USER_ROUTE + '/login', methods=['POST'])
def userLogin():
  return None

@app.route(USER_ROUTE + '/register', methods=['POST'])
def userRegister():
  return None

if __name__ == '__main__':
  app.run(debug=True)