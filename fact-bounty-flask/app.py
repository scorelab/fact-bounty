import os
from dotenv import load_dotenv
from flask import render_template
import coverage

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)

import sys

from api.app import create_app

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

@app.route('/')
def default_route():
        return render_template('index.html')