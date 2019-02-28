import datetime
from ...app import db
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer


class User(db.Model):
    """
    This model holds information about a user registered
    """
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.now())

    def __init__(self, username, password, email):
        """
        Initializes the user instance
        """
        self.name = username
        self.password = password
        self.email = email

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return '<User %r>' % self.username

    def generate_auth_token(self, expiration):
        """
        Generate authorization token

        """
        s = Serializer(current_app.config['SECRET_KEY'],
                       expires_in=expiration)
        return s.dumps({'id': self.id}).decode('utf-8')

    def to_json(self):
        """
        Returns a JSON object

        :return: user JSON object
        """
        user_json = {
            'name': self.name,
            'password': self.password,
            'email': self.email,
            'date': self.date
        }
        return user_json

    @staticmethod
    def verify_auth_token(token):
        """
        Verification of authorization token

        :param token: token for verification
        """
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None

        return User.query.get(data['id'])

    def hash_password(self, password):
        """
        Encrypts the password

        :param password: password for encryption
        """
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """
        Verify the password

        :param password: password for verification
        """
        return pwd_context.verify(password, self.password_hash)
