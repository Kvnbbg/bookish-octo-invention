import json
from datetime import timedelta
from flask import (
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from myapp.models import RecipeDataManager

# ACTIVATING BLUEPRINT
views_bp = Blueprint("views", __name__, template_folder="templates")
views_bp.config = {"permanent_session_lifetime": timedelta(minutes=5)}

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
        return next(
            (User(**user) for user in users_data if user["username"] == username),
            None,
        )

# LOAD USER FUNCTION
@login_manager.user_loader
def load_user(user_id):
    users_data = UserDataManager.load_users()
    user_data = next(
        (user for user in users_data if user["id"] == user_id),
        None,
    )
    if user_data:
        return User(
            user_data["id"],
            user_data["username"],
            user_data["email"],
            user_data["password"],
        )
    else:
        return None

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

# LOGOUT FUNCTION
@views_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Logged out successfully.")
    return redirect(url_for("views.index"))

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

# CONTACT PAGE
@views_bp.route("/contact")
def contact():
    return render_template("contact.html")

# LEGAL PAGE
@views_bp.route("/legal")
def legal():
    return render_template("legal.html")

# CONFIDENTIALITY PAGE
@views_bp.route("/confid")
def confidentiality():
    return render_template("confid.html")

# ERROR HANDLER - INTERNAL SERVER ERROR
@views_bp.errorhandler(500)
def internal_server_error(e):
    current_app.logger.exception(f"Server Error: {e}")
    return render_template("500.html", error_details=str(e)), 500

# ERROR HANDLER - PAGE NOT FOUND
@views_bp.errorhandler(404)
def page_not_found(e):
    current_app.logger.error(f"Page Not Found: {e}")
    return render_template("404.html", error_details=str(e)), 404

# AFTER REQUEST HOOK
@views_bp.after_request
def add_header(response):
    response.cache_control.max_age = 86400
    response.cache_control.public = True
    response.cache_control.must_revalidate = True
    response.cache_control.no_store = True
    return response
