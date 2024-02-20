from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_babel import Babel
import logging
from logging.handlers import RotatingFileHandler
import os

# Initialize Flask extensions
db = SQLAlchemy()
login_manager = LoginManager()
mail = Mail()
migrate = Migrate()
babel = Babel()

def create_app(config_class='myapp.config.Config'):
    app = Flask(__name__, instance_relative_config=True)
    
    # Load configuration
    app.config.from_object(config_class)
    app.config.from_pyfile('config.py', silent=True)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    babel.init_app(app)

    # Setup logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/myapp.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('MyApp startup')

    # Register blueprints
    from myapp.views import views_bp
    app.register_blueprint(views_bp)

    # Setup Flask-Login
    from myapp.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    login_manager.login_view = 'login'

    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()  # In case of database errors
        return render_template('500.html'), 500

    # Additional setup here (e.g., CLI commands, other blueprints)

    return app
