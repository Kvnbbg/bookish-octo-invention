import os
from flask import Flask, render_template, abort
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the Recipe model
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    # Add more fields as needed

    def __repr__(self):
        return f'<Recipe {self.id}: {self.title}>'

# Create tables (run this only once)
db.create_all()

# Check if templates exist
required_templates = ['index.html', 'recipe.html', '404.html', '500.html']
missing_templates = [template for template in required_templates if not os.path.exists(f'templates/{template}')]
if missing_templates:
    print(f"One or more templates are missing: {', '.join(missing_templates)}")
    exit(1)

# Routes
@app.route('/')
def index():
    recipes = Recipe.query.all()
    return render_template('index.html', recipes=recipes)

@app.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)  # Recipe not found

    return render_template('recipe.html', recipe=recipe)

# Error handlers
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
    app.run(debug=True)
