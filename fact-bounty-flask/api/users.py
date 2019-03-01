from flask import jsonify, request, current_app, url_for, g, abort
from . import api
from .models.user import User
from ..app import db

# Routes for user authentication 

# A route to register user
@api.route('/users/register', methods=['POST'])
def add_user():
    """
    Creates the new user

    :param request: the request being processed
    :return: json object with success message 
    """
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    password2 = request.form['password2']
    print('check1')
    if password != password2:
        abort(400) # password not same

    if name is None or password is None or email is None:
        abort(400) # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        abort(400) # existing user

    user = User(name=name, email=email)

    user.hash_password(password)

    db.session.add(user)
    db.session.commit()
    return jsonify({
        'response': 'User ' + name + 'created successfully'
    }), 201

# A route to login user
@api.route('/users/login', methods=['POST'])
def log_user():
    pass
