import os
import json
from datetime import timedelta
import config
from werkzeug.security import check_password_hash, generate_password_hash
from flask import (
    Flask, render_template, request, session, redirect,
    url_for, flash, Blueprint, current_app, config
)
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user, UserMixin
from myapp import models
from instance.config import USERS_FILE

views_bp = Blueprint('views', __name__, template_folder='templates')
views_bp.config = {'permanent_session_lifetime': timedelta(minutes=5)}

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'  # Bootstrap class for flash messages

class User(UserMixin):
    def __init__(self, user_id, username, email, password):
        self.id = user_id
        self.username = username
        self.email = email
        self.password = password

    @staticmethod
    def find_by_username(username):
        users_data = UserDataManager.load_users()
        return next((User(**user) for user in users_data if user['username'] == username), None)

class UserDataManager:
    @staticmethod
    def load_users():
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    @staticmethod
    def save_users(users):
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f)

@login_manager.user_loader
def load_user(user_id):
    # Load user from your data source (e.g., JSON file) and return a User object
    users_data = UserDataManager.load_users()
    user_data = next((user for user in users_data if user['id'] == user_id), None)

    if user_data:
        return User(user_data['id'], user_data['username'], user_data['email'], user_data['password'])
    else:
        return None

@views_bp.route('/')
def index():
    print("views.py index() function called")
    try:
        return render_template('index.html')
    except Exception as e:
        current_app.logger.exception(e)
        return render_template('500.html'), 500

@views_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        users_data = UserDataManager.load_users()

        existing_user = next((user for user in users_data if user['username'] == username or user['email'] == email), None)

        if existing_user:
            flash('Username or email already exists.')
            return redirect(url_for('register'))
        else:
            hashed_password = generate_password_hash(password)
            new_user = {'username': username, 'email': email, 'password': hashed_password}
            users_data.append(new_user)
            UserDataManager.save_users(users_data)

            flash('User created successfully.')
            return redirect(url_for('login'))

    return render_template('register.html')

@views_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        existing_user = User.find_by_username(username)

        if existing_user and check_password_hash(existing_user.password, password):
            session['username'] = username
            session.permanent = True
            login_user(existing_user)
            flash('Logged in successfully.')
            return redirect(url_for('views.profile'))
        else:
            flash('Invalid username/password combination.')
            return redirect(url_for('views.login'))
    return render_template('login.html')

@views_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.')
    return redirect(url_for('index'))

@views_bp.route('/profile')
@login_required
def profile():
    print('views.py profile() function called with username: ', session['username'])
    return render_template('profile.html')

@views_bp.route('/profile/<username>')
@login_required
def profile_username(username):
    print('views.py profile_username() function called with username: ', username)
    flash(f"Hi {username}!")
    return render_template('profile.html', username=username)

@views_bp.route('/recipe/add', methods=['GET', 'POST'])
@login_required
def add_recipe():
    if request.method == 'POST':
        recipe_data = {
            "title": request.form['title'],
            # ... (rest of the fields)
        }

        recipes_data = []  
        recipes_data.append(recipe_data)

        models.RecipeDataManager.save_recipes(recipes_data)

        flash('Recipe created successfully.')
        return redirect(url_for('recipes'))

    return render_template('add_recipe.html')

@views_bp.route('/recipes')
def recipes():
    return render_template('recipe.html')

@views_bp.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
    recipe = models.RecipeDataManager.query.get_or_404(recipe_id)
    return render_template('recipe_detail.html', recipe=recipe)

@views_bp.route('/admin')
def admin():
    return render_template('admin.html')

@views_bp.route('/author')
def author():
    return render_template('author.html')

@views_bp.route('/patient')
def patient():
    return render_template('patient.html')

@views_bp.route('/about')
def about():
    return render_template('about.html')

@views_bp.route('/contact')
def contact():
    return render_template('contact.html')

@views_bp.route('/search')
def search():
    return render_template('search.html')

@views_bp.route('/search_results')
def search_results():
    return render_template('search_results.html')

@views_bp.errorhandler(404)
def page_not_found(e):
    current_app.logger.error('Page Not Found: %s', e)
    return render_template('404.html'), 404

@views_bp.errorhandler(500)
def internal_server_error(e):
    current_app.logger.exception('Server Error: %s', e)
    return render_template('500.html'), 500

@views_bp.after_request
def add_header(response):
    response.cache_control.max_age = 86400
    response.cache_control.public = True
    response.cache_control.must_revalidate = True
    response.cache_control.no_store = True
    return response
