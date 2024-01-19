from flask import Flask
from myapp import __init__


# app.py

"""
This is the main module of the application.
"""

__name__ = '__init__'

app = Flask(__name__)



if __name__ == '__main__':
    app.run()



