# myapp/__init__.py

import logging
import os
from myapp.views import views_bp
from flask import Flask, Blueprint
from .config import DEBUG        # Load configuration from config.py (assuming it's in the parent directory)

logging.basicConfig(filename='error.log', level=logging.DEBUG)
logging.error("Error.log: Debugging is activated.")

app = Flask(__name__)

# Get the path to the directory containing this script
base_dir = os.path.abspath(os.path.dirname(__file__))
config_path = os.path.join(base_dir, "config.py")
app.config.from_pyfile(config_path)

print("Config.py imported by __init__.py")


def create_app():
    print("create_app() function called")
    try:
        

        # Register blueprints
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

        # Set the secret key
        app.secret_key = app.config["ADDITIONAL_PARAM1"]
        print("Additional param 1 is set by __init__.py")

        # Check if running in development mode
        # Activating debugging based on the DEBUG flag
        if DEBUG is True:
            logging.basicConfig(filename='error.log', level=logging.DEBUG)
            logging.error("Error.log: Debugging is activated.")
        else:
            print("Debugging is deactivated.")

# You can use the configuration values (DB_HOST, DB_USER, etc.) in the rest of your application.

        return app

    except Exception as e:
        print(f"Error during app creation: {e}")
        # Optionally, you can log the error using a logging library
        logging.error(f"Error during app creation: {e}", exc_info=True)

        # Gracefully exit the application or return a default app instance
        return Flask(__name__)
