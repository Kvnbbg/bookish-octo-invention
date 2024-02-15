import logging
from datetime import datetime, timedelta

from flask import (
    Blueprint,
    current_app,
    flash,
    json,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from myapp.config import DEBUG, RECIPES_FILE, USERS_FILE
from myapp.models import RecipeDataManager

# ACTIVATING BLUEPRINT
views_bp = Blueprint("views", __name__, template_folder="templates")
views_bp.config = {"permanent_session_lifetime": timedelta(minutes=5)}
views_bp = Blueprint("views", __name__)

# INDEX PAGE
@views_bp.route("/")
def index():
    return render_template("index.html")

# LOGIN FUNCTION
@views_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        existing_user = User.find_by_username(username)
        if existing_user and check_password_hash(existing_user.password, password):
            session["username"] = username
            session.permanent = True
            login_user(existing_user)
            flash("Logged in successfully.", category="success")
            flash(f"Hi {username}!")
            print("Logged in successfully.")
            return redirect(url_for("index,"))
        else:
            print("Invalid username/password combination.")
            flash("Invalid username/password combination.", category="error")
            return render_template(("index"))
    return render_template("index")


# LOGIN PAGE
login_manager = LoginManager()
login_manager.login_view = "views.login"
login_manager.login_message_category = "info"


# USER CLASS
class User(UserMixin):
    def __init__(self, user_id, username, email, password):
        self.id = user_id
        self.username = username
        self.email = email
        self.password = password

    @staticmethod
    def find_by_username(username):
        users_data = UserDataManager.load_users()
        print(
            f"views.py find_by_username() called with username: {username}"
        )
        return next(
            (User(**user) for user in users_data if user["username"] == username), None
        )


# LOAD USER FUNCTION
@login_manager.user_loader
def load_user(user_id):
    users_data = UserDataManager.load_users()
    user_data = next((user for user in users_data if user["id"] == user_id), None)
    if user_data:
        return User(
            user_data["id"],
            user_data["username"],
            user_data["email"],
            user_data["password"],
        )
    else:
        return None


# USER DATA MANAGER CLASS
class UserDataManager:
    @staticmethod
    def load_users():
        print(
            "views.py > UserDataManager > load_users() function called"
        )
        try:
            with open(current_app.config["USERS_FILE"], "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return {}

    @staticmethod
    def save_users(users):
        with open(current_app.config["USERS_FILE"], "w") as f:
            json.dump(users, f)


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
        
        # Save the user role to the session
        session["role"] = role

        if existing_user:
            flash("Username or email already exists.", category="error")
            return redirect(url_for("login"))
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
            return redirect(url_for("login"))
    return render_template("index.html")

@views_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out successfully.")
    return redirect(url_for("index"))

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
        recipes_data = recipe_manager.load_recipes(RECIPES_FILE)

        recipes_data.append(recipe_data)
        recipe_manager.save_recipes(recipes_data, RECIPES_FILE)

        flash("Recipe created successfully.")
        return redirect(url_for("index"))

    return render_template("index.html")

@views_bp.route("/contact")
def contact():
    return render_template("contact.html")

@views_bp.route("/legal")
def legal():
    return render_template("legal.html")

@views_bp.route("/confid")
def legal():
    return render_template("confid.html")

@views_bp.errorhandler(500)
def internal_server_error(e):
    current_app.logger.exception(f"Server Error: {e}")
    return render_template("500.html", error_details=str(e)), 500


@views_bp.errorhandler(404)
def page_not_found(e):
    current_app.logger.error(f"Page Not Found: {e}")
    return render_template("404.html", error_details=str(e)), 404

@views_bp.after_request
def add_header(response):
    response.cache_control.max_age = 86400
    response.cache_control.public = True
    response.cache_control.must_revalidate = True
    response.cache_control.no_store = True
    return response
