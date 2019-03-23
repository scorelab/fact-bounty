from flask import Flask
from flask_login import LoginManager
from flask_pagedown import PageDown
from flask_sqlalchemy import SQLAlchemy
from elasticsearch import Elasticsearch
from flask_cors import CORS

from .config import config

db = SQLAlchemy()
pagedown = PageDown()

login_manager = LoginManager()
login_manager.login_view = 'auth.login'


def create_app(config_name):
    # create and configure the app
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    register_extensions(app)
    register_blueprint(app)

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
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')
    return None

def register_commands(app):
    """Regiter Click commands"""
