# myapp/__init__.py

import logging

from flask import Flask

from myapp.views import views_bp

logging.basicConfig(filename="error.log", level=logging.DEBUG)
logging.error("__init__.py is on.")

app = Flask(__name__)




def create_app():
    logging.error("create_app() function called")
    try:
        # Register blueprints
        app.register_blueprint(views_bp)
        logging.error("Blueprint registered by __init__.py")

        # Set the secret key
        app.secret_key = app.config["ADDITIONAL_PARAM1"]
        logging.error("Additional param 1 is set by __init__.py")

        return app

    except Exception as e:
        logging.error(f"Error during app creation: {e}")
        # Optionally, you can log the error using a logging library
        logging.error(f"Error during app creation: {e}", exc_info=True)

        # Gracefully exit the application or return a default app instance
        return Flask(__name__)
