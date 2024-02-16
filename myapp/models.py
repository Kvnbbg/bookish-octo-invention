import json
import os
from myapp.config import RECIPES_FILE

class RecipeDataManager:
    """
    A class that manages the loading and saving of recipes.
    """

    @staticmethod
    def load_recipes(file_path):
        """
        Load recipes from a file.

        Returns:
            If the file exists and is not empty, returns the loaded recipes as a dictionary.
            If the file does not exist or is empty, returns an empty dictionary.
        """
        if os.path.exists(file_path) and os.stat(file_path).st_size > 0:
            with open(file_path, "r") as f:
                return json.load(f)
        return {}

    @staticmethod
    def save_recipes(recipes, file_path):
        """
        Save recipes to a file.

        Args:
            recipes (dict): The recipes to be saved as a dictionary.
            file_path (str): The path to the file where recipes should be saved.

        Returns:
            None
        """
        with open(file_path, "w") as f:
            json.dump(recipes, f)
