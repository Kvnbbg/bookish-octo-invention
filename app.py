app = Flask(__name__)
DATABASE = 'database.db'

def connect_db():
    return sqlite3.connect(DATABASE)

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    init_db()
    print('Initialized the database.')

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/')
def show_entries():
    db = get_db()
    cur = db.execute('select title, text from entries order by id desc')
    entries = cur.fetchall()
    return render_template('show_entries.html', entries=entries)

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    db = get_db()import os


app = Flask(__name__)
DATABASE = 'database.db'

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

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_db(error):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def home():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes")
    recipes = cursor.fetchall()
    conn.close()
    return render_template('index.html', recipes=recipes)

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        image = request.form['image']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO recipes (title, image, ingredients, instructions)
            VALUES (?, ?, ?, ?)
        ''', (title, image, ingredients, instructions))
        conn.commit()
        conn.close()

        return redirect(url_for('home'))

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))
    recipe = cursor.fetchone()
    conn.close()

    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)  # Recipe not found

    return render_template('recipe.html', recipe=recipe)

# Error handlers for different HTTP error codes
# ...

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    
    # Check if templates exist and initialize the database
    missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '500.html'] if not os.path.exists(f'templates/{template}')]
    if missing_templates:
        app.logger.error(f"One or more templates are missing: {', '.join(missing_templates)}")
        exit(1)

    initialize_database()
    app.logger.info("Database initialized successfully.")
        
    app.run(debug=True, port=5000)

    db.execute('insert into entries (title, text) values (?, ?)',
                 [request.form['title'], request.form['text']])
    db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('show_entries'))

if __name__ == '__main__':
    app.run()
app = Flask(__name__)
DATABASE = 'database.db'

# Initialize the database by creating tables and adding default data
import os
import sqlite3
from flask import Flask, g, render_template, request, abort, redirect, url_for
from contextlib import closing

app = Flask(__name__)
DATABASE = 'database.db'

def connect_db():
    return sqlite3.connect(DATABASE)

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.cli.command('initdb')
def initdb_command():
    init_db()
    print('Initialized the database.')

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/')
def show_entries():
    db = get_db()
    cur = db.execute('SELECT * FROM recipes')
    recipes = cur.fetchall()
    return render_template('index.html', recipes=recipes)

@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        image = request.form['image']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']

        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO recipes (title, image, ingredients, instructions)
            VALUES (?, ?, ?, ?)
        ''', (title, image, ingredients, instructions))
        conn.commit()
        conn.close()

        return redirect(url_for('show_entries'))

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM recipes WHERE id = ?', (recipe_id,))
    recipe = cursor.fetchone()
    conn.close()

    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)  # Recipe not found

    return render_template('recipe.html', recipe=recipe)

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
