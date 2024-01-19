from flask import Flask, app, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from instance import config
from config import app, USERS_FILE
from .models import User, USERS_FILE

@app.route('/authentification')
def authentication():
  return render_template('authentification.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
    session.permanent = True
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
  logout_user()
  flash('Logged out successfully.')
  return redirect(url_for('index'))

def read_users():
    try:
        with open(USERS_FILE, 'r') as file:
            users_data = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        users_data = []
    return users_data

def write_users(users_data):
    with open(USERS_FILE, 'w') as file:
        json.dump(users_data, file)

@app.route('/register', methods=['GET', 'POST'])
def register():
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

