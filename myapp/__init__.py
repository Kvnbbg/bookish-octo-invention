# bookish-octo-invention/myapp/__init__.py
import os
import logging
from flask import Flask
from flask_mail import Mail
from flask_babel import Babel
from myapp.config import Config

mail = Mail()
babel = Babel()

def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)
        register_blueprints(app)
        return app

    except Exception as e:
        handle_error(e)
        return app

def configure_app(app):
    try:
        # If instance/config.py is empty, set the default config
        if not os.path.exists('instance/config.py') or os.stat('instance/config.py').st_size == 0:
            app.config.from_object(Config)
        else:
            base_dir = os.path.abspath(os.path.dirname(__file__))
            config_path = os.path.join(base_dir, "config.py")
            app.config.from_pyfile(config_path)

        # Set configuration values
        app.config['SECRET_KEY'] = app.config['ADDITIONAL_PARAM1']
        app.config['SESSION_TYPE'] = app.config['ADDITIONAL_PARAM2']

        configure_mail(app)
        configure_babel(app)

    except Exception as e:
        handle_error(e)

def configure_mail(app):
    # Configure mail settings
    mail.init_app(app)
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_DEFAULT_SENDER'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_PASSWORD'] = app.config.get("PASSWORD")

def configure_babel(app):
    # Configure Babel settings
    babel.init_app(app)
    app.config['BABEL_DEFAULT_LOCALE'] = 'en'
    app.config['LANGUAGES'] = ['en', 'fr']

def register_blueprints(app):
    try:
        from myapp.views import views_bp
        app.register_blueprint(views_bp)

    except Exception as e:
        handle_error(e)

def handle_error(error):
    print(f"Error: {error}")
    logging.error(f"Error details: {error}", exc_info=True)
