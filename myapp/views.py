# views.py
import os
import json
import config
from flask import Flask, render_template, request, session, redirect, url_for, flash, Blueprint
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user
from myapp import models, forms
from datetime import timedelta

# Load the default configuration
permanent_session_lifetime = timedelta(minutes=5)

views_bp = Blueprint('views', __name__)
  

@views_bp.route('/')
def index():
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
def login():
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
    if user and check_password_hash(user.password, password):
      login_user(user)
      flash('Logged in successfully.')
      return redirect(url_for('profile'))
    else:
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
@login_required
def profile():
  return render_template('profile.html')

@views_bp.route('/profile/<username>')
@login_required
def profile_username(username):
  try:
    # Check if the username contains only valid characters
    if not username.isalnum():
      raise ValueError(f"Invalid input: {username}")

    # Your existing logic here
    return render_template('profile.html', username=username)

  except ValueError as ve:
    app.logger.warning(ve)
    flash("You have entered an invalid input. Please contact the administrator or go to the home page.", 'error')
    return redirect(url_for('index'))

  except Exception as e:
    app.logger.exception(e)
    flash("An unexpected error occurred. Please try again later or contact the administrator.", 'error')
    return redirect(url_for('index'))

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
