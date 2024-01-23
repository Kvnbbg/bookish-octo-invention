# myapp/__init__.py

import logging
import os

from flask import Flask, render_template, Blueprint


def create_app():
    print("create_app() function called")
    try:
        app = Flask(__name__)

        # Register blueprints
        from views import views_bp
        from flask import Flask, render_template, Blueprint
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

        # Get the path to the directory containing this script
        base_dir = os.path.abspath(os.path.dirname(__file__))

        # Load configuration from config.py (assuming it's in the parent directory)
        config_path = os.path.join(base_dir, "..", "config.py")
        app.config.from_pyfile(config_path)
        print("Config.py imported by __init__.py")

        # Set the secret key
        app.secret_key = app.config["ADDITIONAL_PARAM1"]
        print("Additional param 1 is set by __init__.py")

        # Check if running in development mode
        # Activating debugging based on the DEBUG flag
        from config import DEBUG
        if DEBUG is True:
            logging.basicConfig(filename='error.log', level=logging.DEBUG)
            print("Error.log: Debugging is activated.")
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
