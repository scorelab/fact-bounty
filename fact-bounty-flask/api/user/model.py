from datetime import datetime
from flask import current_app
from flask_bcrypt import Bcrypt

# from itsdangerous import (
#     TimedJSONWebSignatureSerializer as Serializer,
#     BadSignature, SignatureExpired)
from api.database import Column, Model, db


class User(Model):
    """
    This model holds information about a user registered
    """

    __tablename__ = "user"

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(80), nullable=False)
    password = Column(db.String(128))
    email = Column(db.String(100), nullable=False, unique=True)
    date = Column(db.DateTime, default=datetime.now())
    votes = db.relationship("vote", backref="user")
    type = Column(db.String(50), default="remote")

    def __init__(self, name, email, password, _type="remote"):
        """
        Initializes the user instance
        """
        self.name = name
        self.email = email
        if password:
            self.password = Bcrypt().generate_password_hash(password).decode()
        self.type = _type

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return "<User %r>" % self.name

    def to_json(self):
        """
        Returns a JSON object

        :return: user JSON object
        """
        user_json = {
            "name": self.name,
            "password": self.password,
            "email": self.email,
            "date": self.date,
        }
        return user_json

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def verify_password(self, password):
        """
        Verify the password

        :param password: password for verification
        """
        return Bcrypt().check_password_hash(self.password, password)

    def save(self):
        """
        Save a user to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()


class RevokedToken(Model):
    """
    This model holds information about revoked tokens, users who have looged out
    """

    __tablename__ = "revoked_tokens"
    id = Column(db.Integer, primary_key=True)
    jti = Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)
