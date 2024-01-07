from common import *

# Blueprint
views = Blueprint('views', __name__)

# Routes

@views.route('/')  # Decorator for the index/home page
def index():
    """Render the index page with a list of recipes."""
    try:
        # Fetch all recipes from the database
        recipes = Recipe.query.all()
    except Exception as e:
        # Log the error and return an error message
        app.logger.error(f"Failed to fetch recipes: {e}")
        return "An error occurred while fetching recipes.", 500

    # Render the index page with the list of recipes
    return render_template('index.html', recipes=recipes)

def show_entries():
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM recipes")
            recipes = cursor.fetchall()
    except Exception as e:
        app.logger.error("Database error: %s", str(e))
        recipes = []

    # Temporary demonstration of a logged-in session
    session['logged_in'] = True  # Simulating a logged-in session
    app.logger.info("User logged in: %s", session['logged_in'])

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