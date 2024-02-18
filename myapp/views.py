from datetime import timedelta
from flask import (
    Flask,
    Blueprint,
    current_app,
    flash,
    redirect,
    render_template,
    request,
    url_for,
    jsonify,
)
from flask_login import login_required, logout_user

# Import i18n translation function
from flask_babel import Babel, lazy_gettext, _


# ACTIVATING BLUEPRINT
views_bp = Blueprint("views", __name__, template_folder="templates")
views_bp.config = {"permanent_session_lifetime": timedelta(minutes=5)}

# Initialize Babel with the Flask app
babel = Babel()
babel.init_app(Flask(__name__))


@views_bp.before_request
def before_request():
    # This function will be executed before each request
    flash_welcome_message()


def flash_welcome_message():
    # Get the visitor's IP address within a route
    visitor_ip = get_visitor_ip()

    # Set the flash message using the visitor's IP
    flash(lazy_gettext(f"Good morning! Happy visit, {visitor_ip}."))


# Get the visitor's IP address
def get_visitor_ip():
    return request.remote_addr


# INDEX PAGE
@views_bp.route("/")
def index():
    return render_template("index.html")


# LOGOUT FUNCTION
@views_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash(_("Logged out successfully."))
    return redirect(url_for("views.index"))


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


# Dynamic route to get OpenAI API key
@views_bp.route("/api/get_openai_key")
def get_openai_key():
    openai_api_key = current_app.config.get("OPENAI_API_KEY", "")
    return jsonify({"openai_api_key": openai_api_key})
