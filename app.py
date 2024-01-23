# app.py
from flask import Flask
from myapp import create_app
"""
This is the main module of the application.
"""

app = Flask(__name__)

if __name__ == '__main__':
   create_app()
   app = Flask(__name__)
   app.run()



