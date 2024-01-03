from flask import Blueprint

views = Blueprint('views', __name__)

# Routes
@views.route('/') # Decorator for the index/home page
def show_entries():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recipes")
    recipes = cursor.fetchall()
    conn.close()
    # Temporary demonstration of a logged-in session
    session['logged_in'] = True  # Simulating a logged-in session
    app.logger.info("App route '/' initialized successfully.")
    return render_template('index.html', recipes=recipes)

@view.route('/add_recipe', methods=['GET', 'POST'])
def add_recipe():
    if request.method == 'POST':
        if not session.get('logged_in'):
            abort(401)

        title = request.form['title']
        image = request.form['image']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']

        add_recipe_to_db(title, image, ingredients, instructions)
        return redirect(url_for('show_entries'))
    
    return render_template('recipe.html')

@view.route('/recipe/<int:recipe_id>')
def show_recipe(recipe_id):
    recipe = get_recipe_by_id(recipe_id)
    if not recipe:
        app.logger.error(f'Recipe with id {recipe_id} not found')
        abort(404)

    return render_template('recipe.html', recipe=recipe)
