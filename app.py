# app.py
from myapp import create_app

"""
This is the main module of the application.
"""

if __name__ == "__main__":
    create_app().run(port=5000)
