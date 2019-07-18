from api.database import Column, Model, db
from datetime import datetime


class Vote(Model):
    """
    This model holds information about a votes casted by user on stories
    """

    __tablename__ = "vote"

    id = Column(db.Integer, primary_key=True)
    story_id = Column(db.String(128))
    user_id = Column(db.Integer, db.ForeignKey("user.id"))
    value = Column(db.Integer)

    def __init__(self, story_id, user_id, value):
        self.story_id = story_id
        self.user_id = user_id
        self.value = value

    @classmethod
    def fetch_user_votes(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    def save(self):
        """
        Save a user to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()
