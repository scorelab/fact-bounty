from flask_login import LoginManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_pagedown import PageDown
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
mail = Mail()
pagedown = PageDown()

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
migrate = Migrate()
