from flask import Blueprint, render_template, request, abort, redirect, url_for, session
from website import recipe, db, app

views = Blueprint('views', __name__)

@views.route('/')
def index():
    try:
        recipes = recipe.query.all()
        return render_template('index.html', recipes=recipes)
    except Exception as e:
        app.logger.error(f"Failed to fetch recipes: {e}")
        return "An error occurred while fetching recipes.", 500

@views.route('/add_recipe', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        if not session.get('logged_in'):
            abort(401)

        if not all([title, image, ingredients, instructions]):
            app.logger.error('Missing form data')
            abort(400)

        try:
            recipe = Recipe(title=title, image=image, ingredients=ingredients, instructions=instructions)
            db.session.add(recipe)
            db.session.commit()
            return redirect(url_for('.index')) # Redirect to the index page after adding the recipe 
        
        except Exception as e:
            app.logger.error(f"Failed to add recipe: {e}")
            abort(500)

    return render_template('recipe.html') # Render the recipe form template for GET requests 

@views.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    try:
        recipe = recipe.query.get(recipe_id)
        if not recipe:
            app.logger.error(f'Recipe with id {recipe_id} not found')
            abort(404)

        return render_template('recipe.html', recipe=recipe)
    except Exception as e:
        app.logger.error(f"Failed to retrieve recipe: {e}")
        abort(500)
