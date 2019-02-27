from flask import Flask
from config import Config
from flask_login import LoginManager
#import database and migrate here


app = Flask(__name__)
app.config.from_object(Config)
#calling  database here
#migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = 'login'


from app import routes, models
