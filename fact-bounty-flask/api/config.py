import os

basedir = os.path.abspath(os.path.dirname(__file__))

"""Constants used throughout the application.
    All hard coded settings/data that are not actual/official configuration
    options for Flask, SQLAlchemy or their extensions goes here.
"""


class Config:
    """Default Flask configuration inherited by all environments. Use this for
    development environments.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.googlemail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in \
        ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    FACTBOUNTY_MAIL_SUBJECT_PREFIX = '[FactBounty] '
    FACTBOUNTY_MAIL_SENDER = 'FactBounty Admin <factbounty@gmail.com>'
    FACTBOUNTY_ADMIN = os.environ.get('FACTBOUNTY_ADMIN')
    POSTS_PER_PAGE = int(os.environ.get('POSTS_PER_PAGE', '4'))
    ES_URL = os.environ.get('ELASTIC_SEARCH_URL') or 'http://localhost:9200'

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
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')
    ES_USERNAME = os.environ.get('ELASTIC_SEARCH_USERNAME')
    ES_PASSWORD = os.environ.get('ELASTIC_SEARCH_PASSWORD')

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)

        # email errors to the administrators
        import logging
        from logging.handlers import SMTPHandler
        credentials = None
        secure = None
        if getattr(cls, 'MAIL_USERNAME', None) is not None:
            credentials = (cls.MAIL_USERNAME, cls.MAIL_PASSWORD)
            if getattr(cls, 'MAIL_USE_TLS', None):
                secure = ()
        mail_handler = SMTPHandler(
            mailhost=(cls.MAIL_SERVER, cls.MAIL_PORT),
            fromaddr=cls.FACTBOUNTY_MAIL_SENDER,
            toaddrs=[cls.FACTBOUNTY_ADMIN],
            subject=cls.FACTBOUNTY_MAIL_SUBJECT_PREFIX + ' Application Error',
            credentials=credentials,
            secure=secure)
        mail_handler.setLevel(logging.ERROR)
        app.logger.addHandler(mail_handler)


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
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
