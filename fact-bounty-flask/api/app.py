import os

from flask import Flask
from flask_cors import CORS
from elasticsearch import Elasticsearch
from apscheduler.schedulers.background import BackgroundScheduler
from scrapyd_api import ScrapydAPI

from api import commands
from api import user, stories, crawler
from api.config import config
from api.extensions import db, pagedown, login_manager

def create_app(config_name):
    # create and configure the app
    app = Flask(__name__, static_folder="../build/static", template_folder="../build")
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    register_extensions(app)
    register_blueprint(app)
    register_shellcontext(app)
    register_commands(app)

    return app

def register_extensions(app):
    """Register Flask extensions"""
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    pagedown.init_app(app)
    if os.environ.get('FLASK_CONFIG') != "production":
        es = Elasticsearch([app.config['ES_URL']])
    else:
        es = Elasticsearch([app.config['ES_URL']], http_auth=(app.config["ES_USERNAME"], app.config["ES_PASSWORD"]))
    app.elasticsearch = es

    scrapyd = ScrapydAPI('http://localhost:6800')
    scheduler = BackgroundScheduler()
    app.scheduler = scheduler
    app.scrapy = scrapyd
    scheduler.start()


def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(user.views.userprint, url_prefix='/api')
    app.register_blueprint(stories.views.storyprint, url_prefix='/api')
    app.register_blueprint(crawler.views.blueprint, url_prefix='/api/crawler')
    return None

def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.urls)

def register_shellcontext(app):
    """Register shell context objects."""
    def shell_context():
        """Shell context objects."""
        return {
            'db': db,
            'User': user.model.User
        }

    app.shell_context_processor(shell_context)
