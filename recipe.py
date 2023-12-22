import os
import sqlite3
import logging
from flask import Flask, render_template, abort, request
from werkzeug.local import LocalProxy, Local


app = Flask(__name__)

DATABASE = 'database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def initialize_database():
    # recipe.py or where you initialize the database
def initialize_database():
    # ...

    # Add a default recipe if the database is empty
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

    # ...

    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT id, name FROM users')
cursor.row_factory = sqlite3.Row  # Setting the row factory
results = cursor.fetchall()

for row in results:
    print(row['id'], row['name'])  # Accessing columns by name

        # Your database initialization code here
        cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL
    )
""")

        # Populate the table if empty, as you did before
        conn.commit()

@app.teardown_appcontext
def close_connection(exception):
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

if __name__ == '__main__':
    initialize_database()  # Call this function explicitly when needed
    app.run(debug=True, port=5500)
