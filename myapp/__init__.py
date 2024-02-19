import os
from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
import logging
from myapp.config import Config, update_zshrc


db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()


def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)

        # Initialize Flask extensions within the application context
        with app.app_context():
            init_extensions(app)

        register_blueprints(app)
        return app

    except Exception as e:
        handle_error(e)
        return app


def configure_app(app):
    try:
        # Check if the 'instance/config.py' file exists and is not empty
        if not os.path.exists('instance/config.py') or os.stat('instance/config.py').st_size == 0:
            # If not, load configuration from the Config class
            app.config.from_object(Config)
        else:
            # If 'instance/config.py' exists and is not empty, load configuration from the file
            base_dir = os.path.abspath(os.path.dirname(__file__))
            config_path = os.path.join(base_dir, "config.py")
            app.config.from_pyfile(config_path)

        # Set the SECRET_KEY and SESSION_TYPE based on Config class
        app.config['SECRET_KEY'] = Config.SECRET_KEY
        app.config['SESSION_TYPE'] = Config.PASSWORD

    except Exception as e:
        # Handle any exceptions that may occur during configuration
        handle_error(e)


def init_extensions(app):
    # Update Zshrc
    update_zshrc()

    # Configure SQLAlchemy database URIs for recipes and users
    app.config['SQLALCHEMY_DATABASE_URI_RECIPES'] = 'sqlite:///recipes.db'
    app.config['SQLALCHEMY_DATABASE_URI_USERS'] = 'sqlite:///users.db'
    
    # Configure multiple database binds for recipes and users
    app.config['SQLALCHEMY_BINDS'] = {'recipes': 'sqlite:///recipes.db', 'users': 'sqlite:///users.db'}
    
    # Disable SQLAlchemy modification tracking for better performance
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize Flask extensions - SQLAlchemy, Login Manager, Mail, and Babel
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)

    from flask_babel import Babel
    babel = Babel(app)
    babel.init_app(app)

    # Configure email settings for sending emails
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_DEFAULT_SENDER'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_PASSWORD'] = app.config.get("PASSWORD")

    # Configure Babel for language localization
    app.config['BABEL_DEFAULT_LOCALE'] = 'en'
    app.config['LANGUAGES'] = ['en', 'fr']


def register_blueprints(app):
    from myapp.views import views_bp
    app.register_blueprint(views_bp)


def handle_error(error):
    print(f"Error: {error}")
    logging.error(f"Error details: {error}", exc_info=True)
