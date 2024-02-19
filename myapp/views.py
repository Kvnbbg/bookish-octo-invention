from datetime import timedelta
from flask import (
    Blueprint,
    flash,
    render_template,
    request,
    redirect,
    url_for,
    jsonify,
    current_app,
)
from flask_login import login_required, logout_user
from flask_babel import lazy_gettext, _

from myapp import db, Recipe


# ACTIVATING BLUEPRINT
views_bp = Blueprint("views", __name__, template_folder="templates")
views_bp.config = {"permanent_session_lifetime": timedelta(minutes=5)}


@views_bp.before_request
def before_request():
    # Flash a welcome message using the visitor's IP
    flash(lazy_gettext(f"Good morning! Happy visit, {get_visitor_ip()}."), category='info')


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


# Routes
@views_bp.route('/delete_recipe/<int:recipe_id>', methods=['GET'])
def delete_recipe(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            db.session.delete(recipe)
            db.session.commit()
            flash('Recipe deleted successfully', 'success')
        else:
            flash('Recipe not found', 'error')
    except Exception as e:
        print(f"Error deleting recipe: {e}")
        flash('Error deleting recipe', 'error')

    return redirect(url_for('your_recipes_route'))

@views_bp.route('/confirm_recipe/<int:recipe_id>', methods=['GET'])
def confirm_recipe(recipe_id):
    # Assuming you have a confirmation logic
    try:
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            recipe.confirmed = True  # Adjust this based on your model fields
            db.session.commit()
            flash('Recipe confirmed successfully', 'success')
        else:
            flash('Recipe not found', 'error')
    except Exception as e:
        print(f"Error confirming recipe: {e}")
        flash('Error confirming recipe', 'error')

    return redirect(url_for('recipe'))

@views_bp.route('/edit_recipe/<int:recipe_id>', methods=['GET'])
def edit_recipe(recipe_id):
    # Assuming you have an edit logic
    try:
        recipe = Recipe.query.get(recipe_id)
        if recipe:
            # Adjust this based on your edit logic
            # For example, you can render an edit form or redirect to an edit page
            return render_template('add_recipe.html', recipe=recipe)
        else:
            flash('Recipe not found', 'error')
    except Exception as e:
        print(f"Error editing recipe: {e}")
        flash('Error editing recipe', 'error')

    return redirect(url_for('add_recipe.html'))

# Dynamic route to get OpenAI API key
@views_bp.route("/api/get_openai_key")
def get_openai_key():
    openai_api_key = current_app.config.get("OPENAI_API_KEY", "")
    return jsonify({"openai_api_key": openai_api_key})
