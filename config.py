import os
from flask import Flask
"""
This module contains the configuration settings for the application.
"""

USERS_FILE = 'users.json'
RECIPES_FILE = 'recipes.json'
SESSION = 'my_session'

DEBUG = False

app = Flask(__name__)

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(os.getcwd(), 'flask_session')
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = 86400  # 24 hours in seconds