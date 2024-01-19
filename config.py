import os
from flask import Flask
from datetime import timedelta

"""
This module contains the configuration settings for the application.
"""

USERS_FILE = 'users.json'
RECIPES_FILE = 'recipes.json'
app.permanent_session_lifetime = timedelta(minutes=5)

DEBUG = False # Set to True if you are debugging

app = Flask(__name__)