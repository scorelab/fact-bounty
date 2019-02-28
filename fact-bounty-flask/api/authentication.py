from flask import jsonify, g, abort
from flask_httpauth import HTTPBasicAuth
from .models.user import User
from .. import api

auth = HTTPBasicAuth()

# To verify password
@auth.verify_password
def verify_password(email_or_token, password):
  """
  Verification of password

  :param email_or_token: email or token of user for verification
  :return: JSON object with success message 
  """
  if email_or_token == '':
    return False
  if password == '':
    g.current_user = User.verify_auth_token(email_or_token)
    g.token_used = True
    return g.current_user is not None
  user = User.query.filter_by(email=email_or_token).first()
  if not user:
    return False
  g.current_user = user
  g.token_used = False
  return user.verify_password(password)

# Error handler
@auth.error_handler
def auth_error():
    return abort(401)


@api.route('/users/tokens', methods=['POST'])
def get_token():
    if g.current_user.is_anonymous or g.token_used:
        return abort(401)
    return jsonify({'token': g.current_user.generate_auth_token(
        expiration=3600), 'expiration': 3600})
