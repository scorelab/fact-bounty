import os
import sys
from . import create_app, db
from .api.models.user import User
from .api.models.story import Story


app = create_app(os.getenv('FLASK_CONFIG') or 'default')
db.create_all(app=create_app('default'))

@app.shell_context_processor
def make_shell_context():
	return dict(db=db, User=User, Story=Story)

@app.cli.command()
def deploy():
	pass