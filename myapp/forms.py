from flask import render_template, flash, redirect, url_for, request, session, Blueprint
from flask_login import login_required, login_user
from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, TextAreaField
from wtforms.validators import DataRequired, Email
from flask_mail import Message
from werkzeug.security import check_password_hash, generate_password_hash
from myapp.models import RecipeDataManager, UserDataManager, User, UserSession
from datetime import timedelta
import json
from flask_mail import mail


# ACTIVATING BLUEPRINT
views_bp = Blueprint("views", __name__, template_folder="templates")
views_bp.config = {"permanent_session_lifetime": timedelta(minutes=5)}


# LOGIN FUNCTION
@views_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        existing_user = User.find_by_username(username, UserSession())
        if existing_user and check_password_hash(existing_user.password, password):
            session["username"] = username
            session.permanent = True
            login_user(existing_user)
            flash("Logged in successfully.", category="success")
            flash(f"Hi {username}!")
            return redirect(url_for("views.index"))
        else:
            flash("Invalid username/password combination.", category="error")
    return render_template("index.html")


# REGISTER FUNCTION
@views_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        users_data = UserDataManager.load_users()
        existing_user = next(
            (
                user
                for user in users_data
                if user["username"] == username or user["email"] == email
            ),
            None,
        )
        role = request.form.get("role")

        session["role"] = role  # Save the user role to the session

        if existing_user:
            flash("Username or email already exists.", category="error")
            return redirect(url_for("views.login"))
        else:
            hashed_password = generate_password_hash(password)
            new_user = {
                "username": username,
                "email": email,
                "password": hashed_password,
            }
            users_data.append(new_user)
            UserDataManager.save_users(users_data)
            flash("User created successfully.", category="success")
            return redirect(url_for("views.login"))
    return render_template("index.html")


class ContactForm(FlaskForm):
    name = StringField('Your Name', validators=[DataRequired()])
    email = EmailField('Your Email', validators=[DataRequired(), Email()])
    message = TextAreaField('Your Message', validators=[DataRequired()])


# ADD RECIPE FUNCTION
@views_bp.route("/recipe/add", methods=["GET", "POST"])
@login_required
def add_recipe():
    if request.method == "POST":
        recipe_data = {
            "title": request.form["title"],
            "description": request.form["description"],
            "ingredients": request.form["ingredients"],
            "instructions": request.form["instructions"],
            "image": request.form["image"],
            "prep_time": request.form["prep_time"],
            "cook_time": request.form["cook_time"],
            "servings": request.form["servings"],
            "cuisine": request.form["cuisine"],
            "course": request.form["course"],
            "diet": request.form["diet"],
            "occasion": request.form["occasion"],
            "author": request.form["author"],
            "source": request.form["source"],
            "url": request.form["url"],
            "notes": request.form["notes"],
        }

        recipe_manager = RecipeDataManager()
        recipes_data = recipe_manager.load_recipes()

        recipes_data.append(recipe_data)
        recipe_manager.save_recipes(recipes_data)

        flash("Recipe created successfully.")
        return redirect(url_for("views.index"))

    return render_template("index.html")


@views_bp.route("/submit_contact_form", methods=['POST'])
def submit_contact_form():
    form = ContactForm()

    if form.validate_on_submit():
        name, email, message = form.name.data, form.email.data, form.message.data

        send_email_to_kevin(name, email, message)
        store_form_data(name, email, message)

        flash('Thank you for reaching out! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    else:
        flash('Please check the form for errors and try again.', 'error')
        return render_template('contact_us.html', form=form)


def send_email_to_kevin(name, email, message):
    try:
        subject = 'New Contact Form Submission'
        recipients = ['KevinMarville@kvnbbg-creations.io']

        # Create and send the message
        msg = Message(subject=subject, recipients=recipients, body=f'Name: {name}\nEmail: {email}\nMessage: {message}')  # noqa: E501
        mail.send(msg)

        print("Email sent successfully.")
    except Exception as e:
        print(f"Error sending email: {e}")


def store_form_data(name, email, message):
    try:
        # Store form data in contact_log.json
        data = {'name': name, 'email': email, 'message': message}
        with open('contact_log.json', 'a') as file:
            json.dump(data, file)
            file.write('\n')
    except Exception as e:
        print(f"Error storing form data: {e}")
