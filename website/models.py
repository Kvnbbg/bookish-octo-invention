from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Define your models using SQLAlchemy
class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    author = db.Column(db.String(50))
    prep_time = db.Column(db.Integer)  # In minutes
    cook_time = db.Column(db.Integer)  # In minutes
    steps = db.Column(db.Text)  # List of steps

    # Ingredients might be a separate table linked by a foreign key,
    # if there are multiple ingredients for a recipe
    ingredients = db.relationship('Ingredient', backref='recipe', lazy=True)

    # Alergens might be stored as a JSON field or separate table
    allergens = db.Column(db.String(200))

    # Diet type might be stored as a list of choices or as a separate table
    diet_type = db.Column(db.String(20))

    # Nutritional information might be a separate table or fields
    nutritional_info = db.Column(db.String(200))

    country = db.Column(db.String(50))
    history = db.Column(db.Text)

    # Administrator flag to denote whether a recipe is editable by admins
    is_editable_by_admin = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"Recipe {self.id}: {self.title}"


# Define Ingredients model if they need to be separate
class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))  # Quantity for the ingredient
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
