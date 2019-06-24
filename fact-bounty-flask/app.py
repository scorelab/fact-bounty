import os
from dotenv import load_dotenv
from flask import render_template

from api.app import create_app
from api.extensions import db

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

app = create_app(os.getenv('FLASK_CONFIG') or 'default')


@app.route('/')
def default_route():
    return render_template('index.html')


db.create_all(app=create_app(os.getenv('FLASK_CONFIG') or 'default'))
