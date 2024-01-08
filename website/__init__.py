_# bookish-octo-invention/website/_init__.py 

from flask import Flask, render_template, request
import logging
import os
from website.auth import auth as auth_blueprint
from website.views import views as views_blueprint
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'hello') # TODO: Change this to a random string before deploying to production environment
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')

# Register Blueprints
app.register_blueprint(views_blueprint)
app.register_blueprint(auth_blueprint)

# Logging Initialization
logging.basicConfig(level=logging.DEBUG)
app.logger.info("Logging initialized successfully.")

# Check for Templates
missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '500.html', 'base.html', 'login.html', 'contact.html', '400.html'] if not os.path.exists(f'website/templates/{template}')]
if missing_templates:
    raise FileNotFoundError(f"One or more templates are missing: {', '.join(missing_templates)}")

# Initialize SQLAlchemy DB
db = SQLAlchemy(app)

# CLI command to initialize the database (if using Flask-Migrate)
@app.cli.command('initdb')
def init_db():
    db.create_all()

# Teardown Functions
@app.teardown_appcontext
def teardown_db(exception):
    db.session.remove()

# Error Handlers
@app.errorhandler(404)
def not_found_error(error):
    app.logger.error('Page not found: %s', request.path)
    return render_template('404.html'), 404

@app.errorhandler(400)
def bad_request_error(error):
    app.logger.error('Bad Request: %s', error)
    return render_template('400.html'), 400

@app.errorhandler(500)
def internal_error(error):
    app.logger.error('Server Error: %s', str(error))
    return render_template('500.html', error=error), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Run the app in debug mode on port 5000 by default