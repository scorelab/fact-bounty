from flask import jsonify, request, current_app, url_for
from .. import api
from .models.user import User
import bcrypt

# Routes for user authentication 

# A route to register user
@api.route('/users/register', method=['POST'])
def add_user():
    """
    Creates the new user

    :param request: the request being processed
    :return: json object with success message 
    """
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']

    pass_enc = str(bcrypt.hashpw(password.encode(
        'utf-8'),  bcrypt.gensalt(10)))[2:-1]

    user = User(name=name, email=email, password=pass_enc)

    db.session.add(user)
    db.session.commit()
    return jsonify({
        'response': 'User ' + name + 'created successfully'
    })

# A route to login user
@api.route('/users/login', methods=['POST'])
def log_user():
    pass
