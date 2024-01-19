# __init__.py

"""
This module initializes the Flask application and sets up the necessary configurations, routes, and database connections.
"""

from flask import render_template, flash, redirect, session, url_for, request, g
from flask_login import login_user, logout_user, current_user, login_required
from .forms import LoginForm, RegisterForm, RecipeForm
from .models import User, Recipe
from werkzeug.security import generate_password_hash, check_password_hash
from models import UserDataManager
from models import RecipeDataManager
from . import UserDataManager
import json
from flask import Flask
from flask_login import LoginManager, UserMixin
import os

app = Flask(__name__, instance_relative_config=True) 
# Load the default configuration
app.config.from_object('config.default')
app.config.from_pyfile('config.py')

