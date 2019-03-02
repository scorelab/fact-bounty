import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

from . import create_app, db
from .api.models.story import Story
from .api.models.user import User


app = create_app(os.getenv('FLASK_CONFIG') or 'default')
db.create_all(app=create_app('default'))


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Story=Story)


@app.cli.command()
def deploy():
    pass
