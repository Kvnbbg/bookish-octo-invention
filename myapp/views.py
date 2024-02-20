from flask import (
    Blueprint, flash, render_template, request, redirect, url_for, jsonify, current_app, session
)
from flask_login import login_required, logout_user, current_user
from flask_babel import _, lazy_gettext as _l
from datetime import timedelta
from myapp.models import db, Recipe
from myapp.forms import RecipeForm

# Blueprint Configuration
views_bp = Blueprint('views', __name__, template_folder='templates')

# Before request actions
@views_bp.before_request
def before_request():
    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=5)
    if not session.get('user_ip'):
        session['user_ip'] = request.remote_addr
        flash(_l(f"Good morning! Happy visit, {session['user_ip']}."), category='info')

# Recipe Dashboard
@views_bp.route('/')
@login_required
def index():
    recipes = Recipe.query.all()
    return render_template('partials/recipe.html', recipes=recipes)

# Add Recipe
@views_bp.route('/add_recipe', methods=['GET', 'POST'])
@login_required
def add_recipe():
    form = RecipeForm()
    if form.validate_on_submit():
        new_recipe = Recipe(
            title=form.title.data,
            description=form.description.data,
            image=form.image.data  # Assume handling image uploads separately
            # Include other fields as necessary
        )
        db.session.add(new_recipe)
        db.session.commit()
        flash(_('Recipe added successfully!'), 'success')
        return redirect(url_for('views.index'))
    return render_template('partials/add_recipe.html', form=form)

# Edit Recipe
@views_bp.route('/edit_recipe/<int:recipe_id>', methods=['GET', 'POST'])
@login_required
def edit_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    form = RecipeForm(obj=recipe)
    if form.validate_on_submit():
        form.populate_obj(recipe)
        db.session.commit()
        flash(_('Recipe updated successfully!'), 'success')
        return redirect(url_for('views.index'))
    return render_template('partials/add_recipe.html', form=form, recipe_id=recipe_id)

# Delete Recipe
@views_bp.route('/delete_recipe/<int:recipe_id>', methods=['POST'])
@login_required
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.session.commit()
    flash(_('Recipe deleted successfully!'), 'success')
    return redirect(url_for('views.index'))

# Confirm Recipe
@views_bp.route('/confirm_recipe/<int:recipe_id>', methods=['POST'])
@login_required
def confirm_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.confirmed = True  # Assuming there's a confirmed attribute
    db.session.commit()
    flash(_('Recipe confirmed successfully!'), 'success')
    return redirect(url_for('views.index'))

# Logout
@views_bp.route("/logout")
@login_required
def logout():
    logout_user()
    flash(_("Logged out successfully."), 'success')
    return redirect(url_for("views.index"))

# Static Pages
@views_bp.route("/contact")
def contact():
    return render_template("contact.html")

@views_bp.route("/legal")
def legal():
    return render_template("legal.html")

@views_bp.route("/confid")
def confidentiality():
    return render_template("confid.html")

# Error Handlers
@views_bp.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@views_bp.errorhandler(500)
def internal_error(e):
    return render_template("500.html"), 500

# Dynamic Content Route Example
@views_bp.route("/api/get_openai_key")
def get_openai_key():
    openai_api_key = current_app.config.get("OPENAI_API_KEY", "")
    return jsonify({"openai_api_key": openai_api_key})
