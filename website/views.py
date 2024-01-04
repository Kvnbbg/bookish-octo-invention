from flask import Blueprint, render_template, request, abort, redirect, url_for, session
from __init__ import app, get_db, add_recipe_to_db, get_recipe_by_id

views = Blueprint('views', __name__)

# Routes
@views.route('/')  # Decorator for the index/home page
def show_entries():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM recipes")
        recipes = cursor.fetchall()

    # Temporary demonstration of a logged-in session
    session['logged_in'] = True  # Simulating a logged-in session
    app.logger.info("App route '/' initialized successfully.")
    
    return render_template('index.html', recipes=recipes)

@views.route('/add_recipe', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        if not session.get('logged_in'):
            abort(401)

        title = request.form.get('title')
        image = request.form.get('image')
        ingredients = request.form.get('ingredients')
        instructions = request.form.get('instructions')

        if not title or not image or not ingredients or not instructions:
            app.logger.error('Missing form data')
            abort(400)

        add_recipe_to_db(title, image, ingredients, instructions)
        return redirect(url_for('.show_entries'))
    
    return render_template('recipe.html')

@views.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    recipe = get_recipe_by_id(recipe_id)
    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)

    return render_template('recipe.html', recipe=recipe)