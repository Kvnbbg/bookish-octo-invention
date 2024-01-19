import os, json
from flask import Flask, render_template, request, session, redirect, url_for, flash
from datetime import timedelta
from flask_login import login_required, login_user, logout_user, UserMixin
from .models import Recipe, User
from . import app, db, login_manager
from .forms import LoginForm, RegisterForm, RecipeForm

# views.py



@app.route('/')
def index():
  try:
    return render_template('index.html')
  except Exception as e:
    app.logger.exception(e)
    return render_template('500.html'), 500

@app.route('/profile') # profile argument replace user argument or username
@login_required
def profile():
  return render_template('profile.html')

@app.route('/profile/<username>')
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

@app.route('/<wi>')
def wrong_input(wi):
  try:
    return "<p>"wi + " is an invalid syntax to my flask app! " + "Hope you are doing well!</p>"
  except Exception as e:
    app.logger.exception(e)
    return render_template('500.html'), 500


@app.route('/add_recipe', methods=['GET', 'POST'])
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


@app.route('/recipe')
def recipes():
  return render_template('recipe.html')

@app.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
  recipe = Recipe.query.get_or_404(recipe_id)
  return render_template('recipe_detail.html', recipe=recipe)


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
