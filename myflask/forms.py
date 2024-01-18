from flask import Flask, app, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User
from . import db

@app.route('/authentification')
def authentication():
  return render_template('authentification.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    username = request.form['username']
    password = request.form['password']
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


@app.route('/register', methods=['GET', 'POST'])
def register():
  """
  Register a new user.

  This function handles the registration process for a new user. It accepts both GET and POST requests.
  If a POST request is received, it retrieves the username, email, and password from the request form.
  It checks if the username or email already exists in the database. If so, it displays an error message.
  If the username and email are unique, it hashes the password and creates a new user in the database.
  Finally, it redirects the user to the login page.

  Returns:
    If a POST request is received and the user is successfully registered, it redirects to the login page.
    Otherwise, it renders the register.html template.

  """
  if request.method == 'POST':
    username = request.form['username']
    email = request.form['email']
    password = request.form['password']
    existing_user = User.query.filter(or_(User.username == username, User.email == email)).first()
    if existing_user:
      flash('Username already exists.')
      return redirect(url_for('register'))
    else:
      hashed_password = generate_password_hash(password)
      new_user = User(username=username, email=email, password=hashed_password)
      db.session.add(new_user)
      db.session.commit()
      flash('User created successfully.')
      return redirect(url_for('login'))
  return render_template('register.html')