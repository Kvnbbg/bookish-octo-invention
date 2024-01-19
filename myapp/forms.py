# forms.py
import os
import json
import config
from flask import render_template, request, session, redirect, url_for, flash
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user
from werkzeug.security import check_password_hash, generate_password_hash

login_manager = LoginManager()

login_manager.login_view = 'login'
login_manager.login_message_category = 'info' # Bootstrap class for flash messages

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
    self.username = username
    self.email = email
    self.password = password

def read_users():
  """
  Read the user data from the USERS_FILE.

  Returns:
    list: The list of user data.
  """
  try:
    with open(USERS_FILE, 'r') as file:
      users_data = json.load(file)
  except (FileNotFoundError, json.JSONDecodeError):
    users_data = []
  return users_data

def write_users(users_data):
  """
  Write the user data to the USERS_FILE.

  Args:
    users_data (list): The list of user data.
  """
  with open(USERS_FILE, 'w') as file:
    json.dump(users_data, file)



