import os
import json
from flask import Flask
from flask_login import LoginManager, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_babel import Babel
import logging
from myapp.views import views_bp


# Import Config class (replace 'your_config_module' with the actual module where Config is defined)
from myapp.config import Config

db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()
babel = Babel()

def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)
        init_extensions(app)
        
        # Initialize SQLAlchemy only if not already initialized
        if not hasattr(app, 'extensions') or 'sqlalchemy' not in app.extensions:
            init_db(app)

        register_blueprints(app)
        return app

    except Exception as e:
        handle_error(e)
        return app

def configure_app(app):
    try:
        if not os.path.exists('instance/config.py') or os.stat('instance/config.py').st_size == 0:
            app.config.from_object(Config)
        else:
            base_dir = os.path.abspath(os.path.dirname(__file__))
            config_path = os.path.join(base_dir, "config.py")
            app.config.from_pyfile(config_path)

        app.config['SECRET_KEY'] = Config.SECRET_KEY
        app.config['SESSION_TYPE'] = Config.PASSWORD

    except Exception as e:
        handle_error(e)

def init_extensions(app):
    app.config['SQLALCHEMY_DATABASE_URI_RECIPES'] = 'sqlite:///recipes.db'
    app.config['SQLALCHEMY_DATABASE_URI_USERS'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_BINDS'] = {'recipes': 'sqlite:///recipes.db', 'users': 'sqlite:///users.db'}
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    babel.init_app(app)

    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_DEFAULT_SENDER'] = 'KevinMarville@kvnbbg-creations.io'
    app.config['MAIL_PASSWORD'] = app.config.get("PASSWORD")

    app.config['BABEL_DEFAULT_LOCALE'] = 'en'
    app.config['LANGUAGES'] = ['en', 'fr']

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def find_by_username(username, session):
        return session.query(User).filter_by(username=username).first()

class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    cooking_time = db.Column(db.Integer, nullable=False)
    resting_time = db.Column(db.Integer, nullable=False)
    diet = db.Column(db.String(50), nullable=False)
    patient_name = db.Column(db.String(50), nullable=False)
    dietitian_name = db.Column(db.String(50), nullable=False)
    ingredients = db.Column(db.String(1000), nullable=False)
    preparation_time = db.Column(db.Integer, nullable=False)
    instructions = db.Column(db.String(2000), nullable=False)
    allergens = db.Column(db.String(200), nullable=True)
    vegetarian = db.Column(db.Boolean, default=False)
    lactose_free = db.Column(db.Boolean, default=False)
    salt_free = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

def init_db(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)


def register_blueprints(app):
    from myapp.views import views_bp
    app.register_blueprint(views_bp)

def handle_error(error):
    print(f"Error: {error}")
    logging.error(f"Error details: {error}", exc_info=True)

