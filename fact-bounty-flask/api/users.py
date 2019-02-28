from flask import jsonify, request, current_app, url_for
from . import api
from models.user import User
import bcrypt


@api.route('/users/register', method=['POST'])
def add_user():
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


@api.route('/users/login', methods=['POST'])
def log_user():
    pass
