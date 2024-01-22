# myapp/__init__.py

import logging
from flask import Flask
from myapp.views import views_bp
import os

def create_app():
    try:
        app = Flask(__name__)

        # Register blueprints
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

        # Get the path to the directory containing this script
        base_dir = os.path.abspath(os.path.dirname(__file__))

        # Load configuration from config.py (assuming it's in the parent directory)
        config_path = os.path.join(base_dir, '..', 'config.py')
        app.config.from_pyfile(config_path)
        print("Config.py imported by __init__.py")

        # Set the secret key
        app.secret_key = app.config['ADDITIONAL_PARAM1']
        print("Additional param 1 is set by __init__.py")

        # Check if running in development mode
        # if app.config['ENV'] == 'development':
        #   print("Running in development mode - additional setup here")

        return app

    except Exception as e:
        print(f"Error during app creation: {e}")
        # Optionally, you can log the error using a logging library
        logging.error(f"Error during app creation: {e}", exc_info=True)

        # Gracefully exit the application or return a default app instance
        return Flask(__name__)
