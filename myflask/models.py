# models.py

"""
This module contains the models for the Flask application.
"""

import os, json
from flask import app

from flask_login import LoginManager
import config

recipes_data = []
USERS_FILE = 'users.json'
RECIPES_FILE = 'recipes.json'

login_manager = LoginManager()

login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(user_id)

class UserDataManager:
  @staticmethod
  def load_users():
    if os.path.exists(config.USERS_FILE):
      with open(config.USERS_FILE, 'r') as f:
        return json.load(f)
    return {}

  @staticmethod
  def save_users(users):
    with open(config.USERS_FILE, 'w') as f:
      json.dump(users, f)

users = UserDataManager.load_users()

class RecipeDataManager:
  """
  A class that manages the loading and saving of recipes.
  """

  @staticmethod
  def load_recipes():
    """
    Load recipes from a file.

    Returns:
      If the file exists and is not empty, returns the loaded recipes as a dictionary.
      If the file does not exist or is empty, returns an empty dictionary.
    """
    if os.path.exists(config.RECIPES_FILE):
      if os.stat(config.RECIPES_FILE).st_size == 0:  # Check if file is empty
        return {}
      else:
        with open(config.RECIPES_FILE, 'r') as f:
          return json.load(f)
    return []
  
  @staticmethod
  def save_recipes(recipes):
    """
    Save recipes to a file.

    Args:
      recipes: The recipes to be saved as a dictionary.

    Returns:
      None
    """
    with open(config.RECIPES_FILE, 'w') as f:
      json.dump(recipes, f)

recipes_data = RecipeDataManager.load_recipes()

