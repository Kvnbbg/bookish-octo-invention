# website/__init__.py

from flask import Flask, g, render_template, request, abort, redirect, url_for, session, Blueprint
import logging
import os
import sqlite3
from contextlib import closing
from .auth import auth as auth_blueprint
from .views import views as views_blueprint

# Create the Flask instance
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'hello')

# Blueprint registration
app.register_blueprint(views_blueprint)
app.register_blueprint(auth_blueprint)

# Logging initialization
logging.basicConfig(level=logging.DEBUG)
app.logger.info("Logging initialized successfully.")

# Check if templates exist and initialize the database
missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '500.html'] if not os.path.exists(f'website/templates/{template}')]
if missing_templates:
    app.logger.error(f"One or more templates are missing: {', '.join(missing_templates)}")
    exit(1)

# Database initialization
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')

def initialize_database(database_path):
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            image TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL
        )
    """)
    # Add default data if necessary...
    conn.close()

def connect_db():
    return sqlite3.connect(DATABASE)

def init_db(database_path):
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    init_db(DATABASE)
    app.logger.info("Database initialization...")

# Teardown functions
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.teardown_appcontext
def close_database_connection(exception):
    close_db(exception)

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
