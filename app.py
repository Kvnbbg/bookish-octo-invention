import os
import sqlite3
import logging
from flask import Flask, render_template, abort, request
from recipe import initialize_database
from werkzeug.local import LocalProxy, Local

# Change the working directory to the directory of this file
print(os.getcwd())
os.chdir(os.path.dirname(os.path.abspath(__file__)))
print(os.getcwd())

# Initialize the Flask application
app = Flask(__name__)

# Initialize the database by running the code from recipe.py
initialize_database()

# Create a LocalProxy for the SQLite connection
_db = Local()

# Function to get the database connection for the current thread
def get_db():
    db = getattr(_db, 'db', None)
    if db is None:
        db = sqlite3.connect('database.db')
        cursor.execute('SELECT id, name FROM users')
cursor.row_factory = sqlite3.Row  # Setting the row factory
results = cursor.fetchall()

for row in results:
    print(row['id'], row['name'])  # Accessing columns by name

        _db.db = db
    return db

# Function to close the database connection for the current thread
def close_db(exception=None):
    db = getattr(_db, 'db', None)
    if db is not None:
        db.close()
        _db.db = None
# app.py
from flask import request

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        image = request.form['image']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']

        # Perform database insertion here using SQLite or SQLAlchemy
        # Example: Insert the received recipe data into the database

        # Redirect to the homepage or wherever needed after adding the recipe
        return redirect(url_for('home'))

# Establish a connection to the SQLite database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Create a route for the index page
@app.route('/')
def index():
    try:
        # Fetch all recipes from the database
        cursor.execute('SELECT * FROM recipes')
        recipes = cursor.fetchall()
        return render_template('index.html', recipe=recipes)
    except Exception as e:
        return str(e)

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    """
    Display a specific recipe based on its ID.

    Args:
        recipe_id (int): The ID of the recipe to display.

    Returns:
        str: The rendered HTML template for the recipe.

    Raises:
        404: If the recipe with the given ID is not found in the database.
    """
    # Use the get_db function to get the database connection for the current thread
    db = get_db()

    # Fetch a specific recipe by its ID from the database
    cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))
    recipe = cursor.fetchone()

    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)  # Recipe not found

    return render_template('recipe.html', recipe=recipe)

# Other routes and error handlers
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

@app.teardown_appcontext
def teardown_db(exception=None):
    # Clean the system when the app context is torn down
    close_db(exception)

if __name__ == '__main__':
    # Set up logging
    logging.basicConfig(level=logging.DEBUG)

     # Check if templates exist and initialize the database
    try:

        # Check if templates exist
        missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '500.html'] if not os.path.exists(f'templates/{template}')]
        if missing_templates:
            app.logger.error(f"One or more templates are missing: {', '.join(missing_templates)}")
            exit(1)

        # Initialize the database
        initialize_database()
        app.logger.info("Database initialized successfully.")
        
        # Run the Flask app
        app.run(debug=True, port=5000)

    except Exception as e:
        app.logger.error("Failed to initialize database: %s", str(e))
        exit(1)

   
