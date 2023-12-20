import sqlite3
from flask import Flask, render_template, abort, request

def initialize_database():
  # Connect to the SQLite database or create it if it doesn't exist
  conn = sqlite3.connect('database.db')
  cursor = conn.cursor()

  # Create a 'recipes' table in the database if it doesn't exist
  cursor.execute("""
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL
    )
  """)

  # Sample data - Inserting some initial recipes into the table if it's empty
  cursor.execute("SELECT COUNT(*) FROM recipes")
  if cursor.fetchone()[0] == 0:
    recipes = [
      {
        'title': 'Pasta Carbonara',
        'image': '{{ url_for('static', filename='pasta-carbonara.jpg') }}',
        'ingredients': 'Spaghetti, Eggs, Bacon, Parmesan Cheese',
        'instructions': 'Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all.'
      },
      {
        'title': 'Chocolate Cake',
        'image': '{{ url_for('static', filename='chocolate-cake.jpg') }}',
        'ingredients': 'Flour, Sugar, Cocoa Powder, Eggs, Milk',
        'instructions': 'Mix dry ingredients. Add wet ingredients. Bake at 350°F.'
      }
    ]

    for recipe in recipes:
      cursor.execute('''
        INSERT INTO recipes (title, image, ingredients, instructions)
        VALUES (?, ?, ?, ?)
      ''', (recipe['title'], recipe['image'], recipe['ingredients'], recipe['instructions']))
    conn.commit()

  conn.close()
