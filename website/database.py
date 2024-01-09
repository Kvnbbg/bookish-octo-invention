from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Define your models using SQLAlchemy
class recipe(db):
    id = request.form.get('id')
    title = request.form.get('title')
    image = request.form.get('image')

    instructions = request.form.get('instructions')
    description = request.form.get('description')
    servings = request.form.get('servings') 

    author = request.form.get('author')
    prep_time = request.form.get('prep_time')
    cook_time = request.form.get('cook_time')
    steps = request.form.get('steps')


    # Ingredients might be a separate table linked by a foreign key,
    # if there are multiple ingredients for a recipe
    ingredients = request.form.get('ingredients')
    allergens = request.form.get('allergens') 
    diet_type = request.form.get('diet_type') 
    nutritional_info = request.form.get('nutritional_info') 
    country = request.form.get('country') 
    history = request.form.get('history') 

    # Administrator flag to denote whether a recipe is editable by admins
    is_editable_by_admin = db.Column(db.Boolean, default=False)


# Define Ingredients model if they need to be separate
class Ingredient(db):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))  # Quantity for the ingredient
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
