class Story(db.Model):
  
	title = db.Column(db.Text, required=True)
	content = db.Column(db.Text, required=True)
	featured_img_url = db.Column(db.Text, required=True)
  approved_count = db.Column(db.Integer, required=True)
	fake_count = db.Column(db.Integer, required=True)
	mixedvote_count = db.Column(db.Integer, required=True)
	date_added = db.Column(db.DateTime, default=datetime.datetime.now())

  def __init__(self, title, content, featured_img_url, fake_count, mixedvote_count):
    self.title = title
    self.content = content
    self.featured_img_url = featured_img_url
    self.approved_count = approved_count
    self.fake_count = fake_count
    self.mixedvote_count = mixedvote_count

  def __repr__(self):
    return '<Task %r>' % self.content

  def to_json(self):
    json_story = {
      'title': self.title,
      'content': self.content,
      'featured_img_url': self.featured_img_url,
      'approved_count': self.approved_count,
      'fake_count': self.fake_count,
      'mixedvote_count': self.mixedvote_count,
      'date_added': self.date_added
    }
  
  @staticmethod
  def from_json(json_post):
    body = json_post.get('body')
    if body is None or body == '':
      raise ValidationError('story does not have a body')
    return Story(body=body)