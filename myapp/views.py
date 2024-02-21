from flask import Flask, Blueprint, render_template, redirect, url_for, flash, jsonify, current_app, session, request
from flask_login import login_required, logout_user, login_user, current_user
from flask_babel import _
from datetime import timedelta
from myapp import db
from myapp.models import Recipe, User
from myapp.forms import RecipeForm, LoginForm, RegistrationForm
from werkzeug.security import generate_password_hash, check_password_hash
import json
from .extensions import login_manager
from flask_mail import Mail, Message


views_bp = Blueprint('views', __name__, template_folder='templates')


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@views_bp.before_request
def before_request():
    session.permanent = True
    current_app.permanent_session_lifetime = timedelta(minutes=5)


views_bp = Blueprint('views', __name__, template_folder='templates')


@views_bp.route('/')
def index():
    return render_template('index.html')
    #recipes = Recipe.query.all()
    #return render_template('partials/recipe.html', recipes=recipes)


@views_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('views.index'))  # Assuming 'index' is your main page

    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            if not is_safe_url(next_page):
                return flask.abort(400)  # Bad Request for non-safe next URLs
            return redirect(next_page or url_for('views.index'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html', form=form)


def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc



@views_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('views.index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(_('Congratulations, you are now a registered user!'), 'success')
        return redirect(url_for('views.login'))
    return redirect(url_for('views.login', form=form))


@views_bp.route('/recipe')
@login_required
def list_recipes():
    form = RecipeForm(request.args)  

    page = request.args.get('page', 1, type=int)
    filter_type = request.args.get('filter', 'all') 
    
    query = Recipe.query
    if filter_type == 'mine':
        query = query.filter_by(author_id=current_user.id)
    elif filter_type == 'top-rated':
        query = query.order_by(Recipe.rating.desc())
    # Imply & Pin your other lines, as (in) growth seeds.

    paginated_recipes = query.paginate(page=page, per_page=10, error_out=False)  # Pagination

    return render_template('partials/recipe.html', recipes=paginated_recipes.items, form=form, pagination=paginated_recipes)


@views_bp.route('/add_recipe', methods=['GET', 'POST'])
@login_required
def add_recipe():
    form = RecipeForm()
    if form.validate_on_submit():
        new_recipe = Recipe(author=current_user, **form.data)
        db.session.add(new_recipe)
        db.session.commit()
        flash(_('Recipe added successfully!'), 'success')
        return redirect(url_for('views.recipe'))
    return render_template('partials/add_recipe.html', form=form)


@views_bp.route('/edit_recipe/<int:recipe_id>', methods=['GET', 'POST'])
@login_required
def edit_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    if recipe.author != current_user:
        flash(_('You are not authorized to edit this recipe.'), 'danger')
        return redirect(url_for('views.index'))
    form = RecipeForm(obj=recipe)
    if form.validate_on_submit():
        form.populate_obj(recipe)
        db.session.commit()
        flash(_('Recipe updated successfully!'), 'success')
        return redirect(url_for('views.index'))
    return render_template('partials/edit_recipe.html', form=form, recipe_id=recipe.id)


@views_bp.route('/delete_recipe/<int:recipe_id>', methods=['POST'])
@login_required
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    if recipe.author != current_user:
        flash(_('You are not authorized to delete this recipe.'), 'danger')
        return redirect(url_for('views.index'))
    db.session.delete(recipe)
    db.session.commit()
    flash(_('Recipe deleted successfully!'), 'success')
    return redirect(url_for('views.index'))


@views_bp.route('/confirm_recipe/<int:recipe_id>', methods=['POST'])
@login_required
def confirm_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.confirmed = True
    db.session.commit()
    flash(_('Recipe confirmed successfully!'), 'success')
    return redirect(url_for('views.index'))


@views_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash(_("Logged out successfully."), 'success')
    return redirect(url_for("views.login"))


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


# Traduction provided by openai for front-end
@views_bp.route("/api/get_openai_key")
def get_openai_key():
    openai_api_key = current_app.config.get("OPENAI_API_KEY", "")
    return jsonify({"openai_api_key": openai_api_key})


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
        return render_template('contact.html', form=form)


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