from datetime import datetime
from flask import current_app
from flask_bcrypt import Bcrypt
from uuid import uuid4

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
    verification_token = Column(db.String(128), nullable=False, unique=True)
    email = Column(db.String(100), nullable=False, unique=True)
    date = Column(db.DateTime, default=datetime.now())
    votes = db.relationship("Vote", backref=db.backref("user"))
    type = Column(db.String(50), default="remote")

    def __init__(self, name, email, password, _type="remote"):
        """
        Initializes the user instance
        """
        self.name = name
        self.email = email
        self.verification_token = self.generate_token()
        if password:
            self.password = self.generate_password_hash(password)
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
        user_json = {"name": self.name, "email": self.email, "date": self.date}
        return user_json

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def find_by_verification_token(cls, verification_token):
        return cls.query.filter_by(
            verification_token=verification_token
        ).first()

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

    def generate_token(self):
        """
        Returns a random token
        """
        return uuid4().hex

    def generate_password_hash(self, password):
        """
        Returns hash of password
        """
        return Bcrypt().generate_password_hash(password).decode()


class RevokedToken(Model):
    """
    This model holds information about revoked tokens, users who have logged out
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
