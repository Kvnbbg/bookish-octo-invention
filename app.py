import os
import sqlite3
from flask import Flask, render_template, abort

app = Flask(__name__)

# Connect to the SQLite database
conn = sqlite3.connect('recipes.db')
cursor = conn.cursor()

@app.route('/')
def index():
    return render_template('index.html', recipes=recipes)

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    if recipe_id < 0 or recipe_id >= len(recipes):
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)  # Recipe not found

    recipe = recipes[recipe_id]
    return render_template('recipe.html', recipe=recipe)

@app.errorhandler(404)
def not_found_error(error):
    app.logger.error('Page not found: %s', (request.path))
    return render_template('404.html'), 404

@app.errorhandler(400)
def bad_request_error(error):
    app.logger.error('Bad Request: %s', (error))
    return render_template('400.html'), 400

@app.errorhandler(500)
def internal_error(error):
    app.logger.error('Server Error: %s', (error))
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Check if templates exist
    missing_templates = [template for template in ['index.html', 'recipe.html', '404.html', '404.html', '500.html'] if not os.path.exists(f'templates/{template}')]
    if missing_templates:
        print(f"One or more templates are missing: {', '.join(missing_templates)}")
        exit(1)

    app.run(debug=True)