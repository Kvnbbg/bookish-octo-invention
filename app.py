from werkzeug.security import check_password_hash, generate_password_hash
import json
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a more secure secret key

USERS_FILE = 'users.json'
RECIPES_FILE = 'recipes.json'

# Database 
class UserDataManager:
    @staticmethod
    def load_users():
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        return {}

    @staticmethod
    def save_users(users):
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f)

class RecipeDataManager:
    @staticmethod
    def load_recipes():
        if os.path.exists(RECIPES_FILE):
            if os.stat('recipes.json').st_size == 0:  # Check if file is empty
                return {}
            else:
                with open(RECIPES_FILE, 'r') as f:
                    return json.load(f)
        return []
    
    @staticmethod
    def save_recipes(recipes):
        with open(RECIPES_FILE, 'w') as f:
            json.dump(recipes, f)


users = UserDataManager.load_users()
recipes_data = RecipeDataManager.load_recipes()

login_manager = LoginManager()
login_manager.init_app(app)
SESSION = 'my_session'


class User(UserMixin):
    def __init__(self, username, email, password, is_admin=False, is_author=False, is_patient=False):
        self.id = username  # Using username as the user ID
        self.username = username
        self.email = email
        self.password = password
        self.is_admin = is_admin
        self.is_author = is_author
        self.is_patient = is_patient

    def __repr__(self):
        return f'<User {self.username}>'


@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)


@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        app.logger.exception(e)
        return render_template('500.html'), 500
        
@app.route('/add_recipe', methods=['GET', 'POST'])
@login_required
def add_recipe():
    if request.method == 'POST':
        # Obtain recipe data from form
        recipe_data = {
            "title": request.form['title'],
            "instructions": request.form['instructions'],
            "description": request.form['description'],
            "servings": request.form['servings'],
            "author_id": request.form['author_id'],
            "prep_time": request.form['prep_time'],
            "cook_time": request.form['cook_time'],
            "steps": request.form['steps'],
            "ingredients": request.form['ingredients'],
            "allergens": request.form['allergens'],
            "diet_type": request.form['diet_type'],
            "nutritional_info": request.form['nutritional_info'],
            "country": request.form['country'],
            "history": request.form['history'],
        }

        # Append recipe to recipes_data
        recipes_data.append(recipe_data)

        # Save recipes to JSON file
        RecipeDataManager.save_recipes(recipes_data)

        flash('Recipe created successfully.')
        return redirect(url_for('recipes'))
    
    return render_template('add_recipe.html')


@app.route('/recipe')
def recipes():
    return render_template('recipe.html')

@app.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return render_template('recipe_detail.html', recipe=recipe)


@app.route('/authentification')
def authentication():
    return render_template('authentification.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            flash('Logged in successfully.')
            return redirect(url_for('profile'))
        else:
            flash('Invalid username/password combination.')
            return redirect(url_for('login'))
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.')
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        existing_user = User.query.filter(or_(User.username == username, User.email == email)).first()
        if existing_user:
            flash('Username already exists.')
            return redirect(url_for('register'))
        else:
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, email=email, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            flash('User created successfully.')
            return redirect(url_for('login'))
    return render_template('register.html')


@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/author')
def author():
    return render_template('author.html')


@app.route('/patient')
def patient():
    return render_template('patient.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/search_results')
def search_results():
    return render_template('search_results.html')


@app.errorhandler(404)
def page_not_found(e):
    app.logger.error('Page Not Found: %s', e)
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    app.logger.exception('Server Error: %s', e)
    return render_template('500.html'), 500


@app.after_request
def add_header(response):
    response.cache_control.max_age = 86400
    response.cache_control.public = True
    response.cache_control.must_revalidate = True
    response.cache_control.no_store = True
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)


