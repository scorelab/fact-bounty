import os

basedir = os.path.abspath(os.path.dirname(__file__))

"""Constants used throughout the application.
    All hard coded settings/data that are not actual/official configuration options for Flask, SQLAlchemy or their
    extensions goes here.
"""


class Config:
    """Default Flask configuration inherited by all environments. Use this for development environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    POSTS_PER_PAGE = 20

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    """Development Congigurations"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') \
        or 'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')
    # needs to be removed in further versions
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data.sqlite')

class DockerConfig(Config):
    @classmethod
    def init_app(cls, app):
        ProductionConfig.init_app(app)

        # log to stderr
        import logging
        from logging import StreamHandler
        file_handler = StreamHandler()
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'docker': DockerConfig,
    'default': DevelopmentConfig
}
