import flask
from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_login import login_required, login_user, logout_user, UserMixin, LoginManager, current_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from instance import config
from config import app, USERS_FILE

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

@app.route('/register', methods=['GET', 'POST'])
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
  
@app.route('/login', methods=['GET', 'POST'])
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

@app.route('/logout')
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


