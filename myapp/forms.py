from flask import (
    render_template, flash, redirect, url_for, request, session, Blueprint
)
from flask_login import login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, NumberRange
from flask_mail import Message
from werkzeug.security import generate_password_hash
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
        if existing_user and existing_user.check_password(password):
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

# Recipe Form
class RecipeForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    ingredients = TextAreaField('Ingredients', validators=[DataRequired()])
    instructions = TextAreaField('Instructions', validators=[DataRequired()])
    image = StringField('Image URL', validators=[DataRequired()])
    prep_time = IntegerField('Preparation Time (minutes)', validators=[DataRequired(), NumberRange(min=1)])
    cook_time = IntegerField('Cooking Time (minutes)', validators=[DataRequired(), NumberRange(min=1)])
    servings = IntegerField('Servings', validators=[DataRequired(), NumberRange(min=1)])
    cuisine = StringField('Cuisine', validators=[DataRequired()])
    course = StringField('Course', validators=[DataRequired()])
    diet = StringField('Diet', validators=[DataRequired()])
    occasion = StringField('Occasion', validators=[DataRequired()])
    author = StringField('Author', validators=[DataRequired()])
    source = StringField('Source', validators=[DataRequired()])
    url = StringField('URL', validators=[DataRequired()])
    notes = TextAreaField('Notes')

# ADD RECIPE FUNCTION
@views_bp.route("/recipe/add", methods=["GET", "POST"])
@login_required
def add_recipe():
    form = RecipeForm()

    if form.validate_on_submit():
        recipe_data = {
            "title": form.title.data,
            "description": form.description.data,
            "ingredients": form.ingredients.data,
            "instructions": form.instructions.data,
            "image": form.image.data,
            "prep_time": form.prep_time.data,
            "cook_time": form.cook_time.data,
            "servings": form.servings.data,
            "cuisine": form.cuisine.data,
            "course": form.course.data,
            "diet": form.diet.data,
            "occasion": form.occasion.data,
            "author": form.author.data,
            "source": form.source.data,
            "url": form.url.data,
            "notes": form.notes.data,
        }

        recipe_manager = RecipeDataManager()
        recipes_data = recipe_manager.load_recipes()

        recipes_data.append(recipe_data)
        recipe_manager.save_recipes(recipes_data)

        flash("Recipe created successfully.", category="success")
        return redirect(url_for("views.index"))

    return render_template("add_recipe.html", form=form)

# this function work in templates/contact.html -->
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

# work in templates/contact.html -->
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

