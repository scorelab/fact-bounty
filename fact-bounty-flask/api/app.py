import os

from flask import Flask
from flask_cors import CORS
from elasticsearch import Elasticsearch
from apscheduler.schedulers.background import BackgroundScheduler
from scrapyd_api import ScrapydAPI
from flask_jwt_extended import JWTManager
from flasgger import Swagger

from api import commands
from api import user, stories, crawler, util, admin
from api.config import config
from api.extensions import db, mail, pagedown, login_manager, migrate, jwt


def create_app(config_name):
    try:
        # create and configure the app
        app = Flask(
            __name__,
            static_folder="../build/static",
            template_folder="../build",
        )
        app.config.from_object(config[config_name])
        config[config_name].init_app(app)

        register_extensions(app)
        register_blueprint(app)
        register_shellcontext(app)
        register_commands(app)

        @app.before_first_request
        def create_tables():
            db.create_all()

        return app
    except Exception as err:
        print("Error occured:", err)


def register_extensions(app):
    """Register Flask extensions"""
    CORS(app)
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    pagedown.init_app(app)
    swag = Swagger(app)  # noqa: F841
    if os.environ.get("FLASK_CONFIG") != "production":
        es = Elasticsearch([app.config["ES_URL"]])
    else:
        es = Elasticsearch(
            [app.config["ES_URL"]],
            http_auth=(app.config["ES_USERNAME"], app.config["ES_PASSWORD"]),
        )
    app.elasticsearch = es

    scrapyd = ScrapydAPI("http://localhost:6800")
    scheduler = BackgroundScheduler()
    app.scheduler = scheduler
    app.scrapy = scrapyd
    scheduler.start()
    jwt.init_app(app)

def register_blueprint(app):
    """Register Flask blueprints."""
    app.register_blueprint(user.views.userprint, url_prefix="/api/users")
    app.register_blueprint(stories.views.storyprint, url_prefix="/api/stories")
    app.register_blueprint(crawler.views.blueprint, url_prefix="/api/crawler")
    app.register_blueprint(util.views.utilprint, url_prefix="/api/utils")
    app.register_blueprint(admin.views.adminprint, url_prefix="/api/admin")
    return None


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)
    app.cli.add_command(commands.clean)
    app.cli.add_command(commands.urls)
    app.cli.add_command(commands.deploy)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": user.model.User}

    app.shell_context_processor(shell_context)
