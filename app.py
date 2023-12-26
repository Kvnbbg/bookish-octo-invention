# Initialize the database by creating tables and adding default data
import os
import sqlite3
from flask import Flask, g, render_template, request, abort, redirect, url_for, session, flash
import logging
from contextlib import closing

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database/database.db')

logging.basicConfig(level=logging.DEBUG)

# Check if templates exist and initialize the database
missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '500.html'] if not os.path.exists(f'templates/{template}')]
if missing_templates:
    app.logger.error(f"One or more templates are missing: {', '.join(missing_templates)}")
    exit(1)

def initialize_database():
    conn = sqlite3.connect(DATABASE)
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

    cursor.execute("SELECT COUNT(*) FROM recipes")
    if cursor.fetchone()[0] == 0:
        default_recipe = {
            'title': 'Default Recipe',
            'image': 'default_image_url.jpg',
            'ingredients': 'Default ingredients',
            'instructions': 'Default instructions'
        }

        cursor.execute('''
            INSERT INTO recipes (title, image, ingredients, instructions)
            VALUES (?, ?, ?, ?)
        ''', (default_recipe['title'], default_recipe['image'],
              default_recipe['ingredients'], default_recipe['instructions']))
        conn.commit()

    conn.close()

initialize_database()
app.logger.info("Database initialized successfully.")


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    init_db()
    app.logger.info("Database initialization...")

def connect_db():
    return sqlite3.connect(DATABASE)

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.teardown_appcontext
def close_database_connection(exception):
    close_db(exception)

# Routes
@app.route('/')
def show_entries():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes")
    recipes = cursor.fetchall()
    conn.close()
    # Temporary demonstration of a logged-in session
    session['logged_in'] = True  # Simulating a logged-in session
    app.logger.info("App route '/' initialized successfully.")
    return render_template('index.html', recipes=recipes)

@app.route('/add_recipe', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        if not session.get('logged_in'):
            abort(401)

        title = request.form['title']
        image = request.form['image']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']

        add_recipe_to_db(title, image, ingredients, instructions)
        return redirect(url_for('show_entries'))
    
    return render_template('add_recipe.html')

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    recipe = get_recipe_by_id(recipe_id)
    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)

    return render_template('recipe.html', recipe=recipe)

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
    app.run(debug=True, port=5000)