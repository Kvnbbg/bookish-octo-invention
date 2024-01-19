from flask import Flask
# instance/config.py

"""
This module contains the configuration settings for the application.
"""

DEBUG = True
app = Flask(__name__)
app.secret_key = 'my_secret_key_is_hello'  # Replace with a more secure secret key
