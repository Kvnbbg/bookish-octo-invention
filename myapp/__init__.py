import os
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_migrate import Migrate
from flask_babel import Babel
from logging.handlers import RotatingFileHandler
from myapp.config import DevelopmentConfig, TestingConfig, ProductionConfig, update_zshrc
from .extensions import login_manager
from .models import User

# Initialize Flask extensions
db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
babel = Babel()


def create_app(config_filename=None):
    app = Flask(__name__, instance_relative_config=True)

    # Determine the configuration to use based on the FLASK_ENV environment variable
    env_config = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig,
    }
    config_name = os.getenv('FLASK_ENV', 'development')
    app.config.from_object(env_config.get(config_name, DevelopmentConfig))

    # Update .zshrc with config variables, if necessary
    update_zshrc()

    # Ensure database configuration is set
    if not app.config.get('SQLALCHEMY_DATABASE_URI') and not app.config.get('SQLALCHEMY_BINDS'):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'app.db')
        os.makedirs(app.instance_path, exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    babel.init_app(app)

    # Setup logging
    if not app.debug and not app.testing:
        setup_logging(app)

    # Register blueprints and error handlers
    register_blueprints(app)
    register_error_handlers(app)

    return app


def setup_logging(app):
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/myapp.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('MyApp startup')


def register_blueprints(app):
    # Register blueprints
    from myapp.views import views_bp
    app.register_blueprint(views_bp)


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return render_template('500.html'), 500
