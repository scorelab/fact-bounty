import os
from dotenv import load_dotenv
import coverage

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

COV = None
if os.environ.get('FLASK_COVERAGE'):
    COV = coverage.coverage(branch=True, include='api/*')
    COV.start()

import sys
import click
from flask_migrate import Migrate, upgrade
from . import create_app, db
from .api.models.story import Story
from .api.models.user import User

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
migrate = Migrate(app, db)
db.create_all(app=create_app('default'))


@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Story=Story)

@app.cli.command()
@click.option('--coverage/--no-coverage', default=False,
              help='Run tests under code coverage.')
def test(coverage):
    """Run the unit tests."""
    if coverage and not os.environ.get('FLASK_COVERAGE'):
        import subprocess
        os.environ.get['FLASK_COVERAGE'] = '1'
        sys.exit(subprocess.call(sys.argv))
    
    import unittest
    testmodules = [
    'fact-bounty-flask.tests.authentication.register',
    'fact-bounty-flask.tests.authentication.login',
    'fact-bounty-flask.tests.story_test'
    ]
    suite = unittest.TestSuite()
    for t in testmodules:
        try:
            # If the module defines a suite() function, call it to get the suite.
            mod = __import__(t, globals(), locals(), ['suite'])
            suitefn = getattr(mod, 'suite')
            suite.addTest(suitefn())
        except (ImportError, AttributeError):
            # else, just load all the test cases from the module.
            suite.addTest(unittest.defaultTestLoader.loadTestsFromName(t))

    unittest.TextTestRunner().run(suite)

@app.cli.command()
def deploy():
    # migrate database to latest revision
    upgrade()