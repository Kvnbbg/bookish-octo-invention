# __init__.py 

from flask import Flask
from myapp.views import app, views  # Import the Flask app and views from the views.py file

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
