import os
import json
import config
from flask import render_template, request, session, redirect, url_for, flash
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user

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
        return {}

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

# Initialize RecipeDataManager and load recipes
recipe_manager = RecipeDataManager()
recipes_data = recipe_manager.load_recipes()
