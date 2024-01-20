# config.py

"""
This module contains the configuration settings for the application.
"""
if 1 > 0:
    from instance.config import (
        DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ADDITIONAL_PARAM1, ADDITIONAL_PARAM2, USERS_FILE, RECIPES_FILE, DEBUG
    )
    print("Config instance import: OK")
   
else:
    DB_HOST = "actual_host"
    DB_USER = "actual_user"
    DB_PASSWORD = "actual_password"
    DB_NAME = "actual_db_name"
    ADDITIONAL_PARAM1 = "actual_value1"
    ADDITIONAL_PARAM2 = "actual_value2"
    USERS_FILE = 'users.json'
    RECIPES_FILE = 'recipes.json'
    DEBUG = False  # Set to True if you are debugging
    print("Config instance import: Error - Using default values")

# Activating debugging based on the DEBUG flag
if DEBUG == True:
    print("Debugging is activated.")
else:
    print("Debugging is deactivated.")

# You can use the configuration values (DB_HOST, DB_USER, etc.) in the rest of your application.
