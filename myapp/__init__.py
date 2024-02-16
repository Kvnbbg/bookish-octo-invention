import os
from flask import Flask
from myapp.views import views_bp
import logging
from flask_mail import Mail

# Initialize Flask-Mail with the app
mail = Mail()

def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)
        register_blueprints(app)
        mail.init_app(app)  # Initialize Flask-Mail with the app
        return app

    except Exception as e:
        handle_error(e)
        return app

def configure_app(app):
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        config_path = os.path.join(base_dir, "config.py")
        app.config.from_pyfile(config_path)

        # MAIL SETTINGS
        app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use the SMTP server of your email provider
        app.config['MAIL_PORT'] = 587  # Port for TLS
        app.config['MAIL_USE_TLS'] = True  # Enable TLS support
        app.config['MAIL_USE_SSL'] = False  # Disable SSL to ensure TLS is used
        app.config['MAIL_USERNAME'] = 'KevinMarville@kvnbbg-creations.io'
        app.config['MAIL_DEFAULT_SENDER'] = 'KevinMarville@kvnbbg-creations.io'
        app.config['MAIL_PASSWORD'] = app.config.get("PASSWORD")  # Set the PASSWORD from the config file

        # Set the secret key
        app.secret_key = app.config["ADDITIONAL_PARAM1"]
        print("Additional param 1 for SECRET KEY is set by __init__.py")

        print("MAIL SETTINGS configured by __init__.py")

    except Exception as e:
        handle_error(e)

def register_blueprints(app):
    try:
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

    except Exception as e:
        handle_error(e)

def handle_error(error):
    print(f"Error: {error}")
    # Optionally, you can log the error using a logging library
    logging.info(f"Error details: {error}", exc_info=True)

# If __name__ == "__main__":
#     create_app().run()
