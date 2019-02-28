from datetime import datetime
from . import db, login_manager
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer

class User(db.model):
  name = db.Column(db.String(80), nullable=False)
  password = db.Column(db.String(20), nullable=False)
  email = db.Column(db.String(100), unique=True, nullable=False)
  date = db.Column(db.DateTime, default=datetime.datetime.now())

  def __init__(self, username, password, email):
    self.name = name
    self.password = password
    self.email = email

  def __repr__(self):
    return '<User %r>' % self.username

  def generate_auth_token(self, expiration):
    s = Serializer(current_app.config['SECRET_KEY'],
                   expires_in=expiration)
    return s.dumps({'id': self.id}).decode('utf-8')

  def to_json(self):
    user_json = {
      'name': self.name,
      'password': self.password,
      'email': self.email,
      'date': self.date
    }
    return user_json

  @staticmethod
  def verify_auth_token(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
      data = s.loads(token)
    except:
      return None

    return User.query.get(data['id'])
  
  def hash_password(self, password):
    self.password_hash = pwd_context.encrypt(password)

  def verify_password(self, password):
    return pwd_context.verify(password, self.password_hash)