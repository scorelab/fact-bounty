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
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')
    # needs to be removed in further versions
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    

config = {
    'development': DevelopmentConfig,

    'default': DevelopmentConfig
}