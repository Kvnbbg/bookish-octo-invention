import sqlite3
import json

def initialize_database():
  # Connect to the SQLite database or create it if it doesn't exist
  conn = sqlite3.connect('recipes.db')
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
    sample_recipes = [
      {
        'title': 'Pasta Carbonara',
        'image': 'https://example.com/pasta-carbonara.jpg',
        'ingredients': 'Spaghetti, Eggs, Bacon, Parmesan Cheese',
        'instructions': 'Cook spaghetti. Fry bacon. Mix eggs and cheese. Combine all.'
      },
      {
        'title': 'Chocolate Cake',
        'image': 'https://example.com/chocolate-cake.jpg',
        'ingredients': 'Flour, Sugar, Cocoa Powder, Eggs, Milk',
        'instructions': 'Mix dry ingredients. Add wet ingredients. Bake at 350°F.'
      }
    ]

    for recipe in sample_recipes:
      cursor.execute('''
        INSERT INTO recipes (title, image, ingredients, instructions)
        VALUES (?, ?, ?, ?)
      ''', (recipe['title'], recipe['image'], recipe['ingredients'], recipe['instructions']))
    conn.commit()

  conn.close()
