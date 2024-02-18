import os
import logging
from flask import Flask
from flask_mail import Mail
from flask_babel import Babel

# Initialize Flask extensions
mail = Mail()
babel = Babel()


def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)
        register_extensions(app)
        register_blueprints(app)
        return app

    except Exception as e:
        handle_error(e)
        return app


def configure_app(app):
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        config_path = os.path.join(base_dir, "config.py")
        app.config.from_pyfile(config_path)
       
        configure_mail(app)
        configure_babel(app)

    except Exception as e:
        handle_error(e)


def configure_mail(app):
    # MAIL SETTINGS
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587  # Port for TLS
    app.config['MAIL_USE_TLS'] = True  # Enable TLS support
    app.config['MAIL_USE_SSL'] = False  # Disable SSL to ensure TLS is used
    app.config['MAIL_USERNAME'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_DEFAULT_SENDER'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_PASSWORD'] = app.config.get("PASSWORD") 

    print("MAIL SETTINGS configured by __init__.py")


def configure_babel(app):
    # Babel configurations
    babel.init_app(app)
    app.config['BABEL_DEFAULT_LOCALE'] = 'en'  # Set your default locale
    app.config['LANGUAGES'] = ['en', 'fr']  # Add the languages you want to support


def register_extensions(app):
    mail.init_app(app)  # Initialize Flask-Mail with the app
    babel.init_app(app)  # Initialize Babel with the Flask app


def register_blueprints(app):
    try:
        from myapp.views import views_bp
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

    except Exception as e:
        handle_error(e)


def handle_error(error):
    print(f"Error: {error}")
    # Optionally, you can log the error using a logging library
    logging.error(f"Error details: {error}", exc_info=True)
