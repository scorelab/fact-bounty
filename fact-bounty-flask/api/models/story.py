from datetime import datetime

from ... import db


class Story(db.Model):
    """ This model holds information about Story """

    __tablename__ = 'story'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    featured_img_url = db.Column(db.Text, nullable=False)
    approved_count = db.Column(db.Integer, nullable=False)
    fake_count = db.Column(db.Integer, nullable=False)
    mixedvote_count = db.Column(db.Integer, nullable=False)
    date_added = db.Column(db.Text, default=datetime.now())

    def __init__(self, title, content, featured_img_url, approved_count, fake_count, mixedvote_count):
        """
        Initialize the instance
        """
        self.title = title
        self.content = content
        self.featured_img_url = featured_img_url
        self.approved_count = approved_count
        self.fake_count = fake_count
        self.mixedvote_count = mixedvote_count

    def __repr__(self):
        """
        Returns the object reprensentation
        """
        return '<Task %r>' % self.content

    def to_json(self):
        """
        Returns a JSON object

        :return: user JSON object
        """
        json_story = {
            'title': self.title,
            'content': self.content,
            'featured_img_url': self.featured_img_url,
            'approved_count': self.approved_count,
            'fake_count': self.fake_count,
            'mixedvote_count': self.mixedvote_count,
            'date_added': self.date_added
        }
        return json_story
