# __init__.py
"""
This module initializes the Flask application and sets up the necessary configurations, routes, and database connections.
"""
import config
from datetime import timedelta
from myapp import views

# Load the default configuration
app.config.from_pyfile('config.py')
app.permanent_session_lifetime = timedelta(minutes=5)
