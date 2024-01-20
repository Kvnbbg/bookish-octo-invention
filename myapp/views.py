# views.py
import os
import json
import config
from flask import Flask, render_template, request, session, redirect, url_for, flash, Blueprint
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user
from myapp import models
from datetime import timedelta
from werkzeug.security import check_password_hash, generate_password_hash


# Load the default configuration
permanent_session_lifetime = timedelta(minutes=5)

views_bp = Blueprint('views', __name__)

   
@views_bp.route('/')
def index():
  print("views.py index() function called")
  try:
    return render_template('index.html')
  except Exception as e:
    app.logger.exception(e)
    return render_template('500.html'), 500


@views_bp.route('/register', methods=['GET', 'POST'])
def register():
  """
  Route for user registration.

  Returns:
    flask.Response: The response object.
  """
  if request.method == 'POST':
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']

    users_data = read_users()

    existing_user = next((user for user in users_data if user['username'] == username or user['email'] == email), None)

    if existing_user:
      flash('Username or email already exists.')
      return redirect(url_for('register'))
    else:
      hashed_password = generate_password_hash(password)
      new_user = {'username': username, 'email': email, 'password': hashed_password}
      users_data.append(new_user)
      write_users(users_data)

      flash('User created successfully.')
      return redirect(url_for('login'))

  return render_template('register.html')


@views_bp.route('/login', methods=['GET', 'POST'])
print('views.py login() routes called')

def login():
  print(' views.py login() function called')
  """
  Route for user login.

  Returns:
    flask.Response: The response object.
  """
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
    session.permanent = True
    session['username'] = username
    user = User.query.filter_by(username=username).first()
    print('login post method: Ok. User: ', user) # User:  <User 1> or None if user does not exist in database
    if user and check_password_hash(user.password, password):
      login_user(user)
      print('Logged in successfully. User: ', user) 
      flash('Logged in successfully.')
      return redirect(url_for('profile'))
    else:
      print('Invalid username/password combination. User: ', user) # User:  None 
      flash('Invalid username/password combination.')
      return redirect(url_for('login'))
  return render_template('login.html')

@views_bp.route('/logout')
@login_required
def logout():
  """
  Route for user logout.

  Returns:
    flask.Response: The response object.
  """
  logout_user()
  flash('Logged out successfully.')
  return redirect(url_for('index'))

@views_bp.route('/profile') # profile argument replace user argument or username
 print(' views.py profile() routes called')
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

@views_bp.route('/<wi>')
def wrong_input(wi):
  try:
    return "<p>"+ wi + " is an invalid syntax to my flask app! " + "Hope you are doing well!</p>"
  except Exception as e:
    app.logger.exception(e)
    return render_template('500.html'), 500


@views_bp.route('/add_recipe', methods=['GET', 'POST'])
@login_required
def add_recipe():
  """
  Add a new recipe to the application.

  If the request method is POST, obtain the recipe data from the form,
  append it to the recipes_data list, save the recipes to a JSON file,
  display a flash message indicating successful creation, and redirect
  to the 'recipes' page.

  If the request method is GET, render the 'add_recipe.html' template.

  Returns:
  If the request method is POST, redirects to the 'recipes' page.
  If the request method is GET, renders the 'add_recipe.html' template.
  """
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
    recipes_data = []  # Declare the recipes_data variable
    recipes_data.append(recipe_data)

  # Save recipes to JSON file
  RecipeDataManager.save_recipes(recipes_data)

  flash('Recipe created successfully.')
  return redirect(url_for('recipes'))
  
  return render_template('add_recipe.html')


@views_bp.route('/recipe')
def recipes():
  return render_template('recipe.html')

@views_bp.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
  recipe = Recipe.query.get_or_404(recipe_id)
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
  app.logger.error('Page Not Found: %s', e)
  return render_template('404.html'), 404


@views_bp.errorhandler(500)
def internal_server_error(e):
  app.logger.exception('Server Error: %s', e)
  return render_template('500.html'), 500


@views_bp.after_request
def add_header(response):
  response.cache_control.max_age = 86400
  response.cache_control.public = True
  response.cache_control.must_revalidate = True
  response.cache_control.no_store = True
  return response

login_manager = LoginManager()

login_manager.login_view = 'login'
login_manager.login_message_category = 'info' # Bootstrap class for flash messages

@login_manager.user_loader
def load_user(user_id):
   print(' views.py load_user() function called')
  return User.query.get(user_id)

class UserDataManager:
   print(' views.py UserDataManager() class called')
  @staticmethod
  def load_users():
     print(' views.py UserDataManager() load_users function called')
    if os.path.exists(config.USERS_FILE):
      with open(config.USERS_FILE, 'r') as f:
        return json.load(f)
    return {}

  @staticmethod
  def save_users(users):
    with open(config.USERS_FILE, 'w') as f:
      json.dump(users, f)
       print(' views.py UserDataManager() save_users function called with users: ', users)

users = UserDataManager.load_users()

class UserRegistrationForm:
  """
  A class representing a user registration form.

  Args:
    username (str): The username of the user.
    email (str): The email address of the user.
    password (str): The password of the user.

  Attributes:
    username (str): The username of the user.
    email (str): The email address of the user.
    password (str): The password of the user.
  """

  def __init__(self, username, email, password):
    print(' views.py UserRegistrationForm() function called')
    self.username = username
    self.email = email
    self.password = password

def read_users():
  print(' views.py read_users() function called')
  """
  Read the user data from the USERS_FILE.

  Returns:
    list: The list of user data.
  """
  try:
    with open(USERS_FILE, 'r') as file:
      users_data = json.load(file)
       print(' views.py read_users() function called with users_data: ', users_data)
  except (FileNotFoundError, json.JSONDecodeError):
    users_data = []
     print('error in views.py read_users() function called with users_data: ', users_data')
  return users_data

def write_users(users_data):
  """
  Write the user data to the USERS_FILE.

  Args:
    users_data (list): The list of user data.
  """
  with open(USERS_FILE, 'w') as file:
    json.dump(users_data, file)
      print(' views.py write_users() function called with users_data: ', users_data)
