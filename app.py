from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db' # Path to database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Silence the deprecation warning
db = SQLAlchemy(app) # Instantiate the database object

# Define your models below
class recipe(db.Model): # Define a recipe model by extending the db.Model class 
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy 
    title = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes 
    # image = db.Column(db.image) # Column definitions are bound to model attributes 
    instructions = db.Column(db.Text) # Column definitions are bound to model attributes 
    description = db.Column(db.Text) # Column definitions are bound to model attributes 
    servings = db.Column(db.Integer) # Column definitions are bound to model attributes 
    author = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    steps = db.Column(db.Integer)
    ingredients = db.Column(db.Text)
    allergens = db.Column(db.Text)
    diet_type = db.Column(db.Text)
    nutritional_info = db.Column(db.Text)
    country = db.Column(db.Text)
    history = db.Column(db.Text)
    is_editable_by_admin = db.Column(db.Boolean, default=False)

class Ingredient(db.Model): # Define a Ingredient model by extending the db.Model class 
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy 
    name = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes
    quantity = db.Column(db.String(50))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

# Define the routes for your application below
@app.route('/') # Home page route - displays nav bar, search bar, section about and my services from the administrator and footer
def index(): 
    return render_template('index.html') # Render the template located in /templates/index.html

@app.route('/recipe') # Recipes page route - displays all recipes creations from the administrator
def recipes(): 
    return render_template('recipe.html') # Render the template located in /templates/recipe.html

@app.route('/authentication') # Login page route - displays login form for the administrator, author or  patient
def authentication(): 
    return render_template('authentication.html')

if __name__ == '__main__': # Runs the application 
    db.create_all() # Create the database tables for our data models defined above if they don't exist yet 
    app.run(debug=True) # Run the app in debug mode if any code changes occur
