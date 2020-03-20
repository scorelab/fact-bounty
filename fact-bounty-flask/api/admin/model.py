from api.database import Column, Model, db

class Admin(Model):
    """
    This model holds information about an admin registered
    """

    __tablename__ = "admin"

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(80), nullable=False)
    email = Column(db.String(100), nullable=False, unique=True)
    password = Column(db.String(128))

    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    def __init__(self, name, password, email):
        self.name = name
        self.email = email
        self.password = password

    def save(self):
        """
        Save a user to the database.
        This includes creating a new user and editing one.
        """
        db.session.add(self)
        db.session.commit()