from flask import Flask
from elasticsearch import Elasticsearch
from flask_cors import CORS

from api import commands
from api import user
from api.config import config
from api.extensions import db, pagedown, login_manager

def create_app(config_name):
    # create and configure the app
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    register_extensions(app)
    register_blueprint(app)
    register_commands(app)

    return app

def register_extensions(app):
    """Register Flask extensions"""
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    pagedown.init_app(app)
    app.elasticsearch = Elasticsearch()
    return None

def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(user.views.blueprint, url_prefix='/api')
    app.register_blueprint(stories.views.blueprint, url_prefix='/api')
    return None

def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.urls)
