# config.py

"""
This module contains the configuration settings for the application.
"""
try:
  from instance.config import (
    DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, ADDITIONAL_PARAM1, ADDTIONAL_PARAM2, USERS_FILE, RECIPES_FILE, DEBUG
  )
except ImportError:
  DB_HOST = "actual_host"
  DB_USER = "actual_user"
  DB_PASSWORD = "actual_password"
  DB_NAME = "actual_db_name"
  ADDITIONAL_PARAM1 = "actual_value1"
  ADDTIONAL_PARAM2 = "actual_value2"
  USERS_FILE = 'users.json'
  RECIPES_FILE = 'recipes.json'
  DEBUG = False # Set to True if you are debugging