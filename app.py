from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required
from werkzeug.security import check_password_hash, generate_password_hash
import logging
from datetime import datetime

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
app.secret_key = 'your_secret_key'  # Replace with a more secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
SESSION = 'my_session'


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.Text)
    description = db.Column(db.Text)
    servings = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    steps = db.Column(db.Integer)
    ingredients = db.Column(db.Text)
    allergens = db.Column(db.Text)
    diet_type = db.Column(db.Text)
    nutritional_info = db.Column(db.Text)
    country = db.Column(db.Text)
    history = db.Column(db.Text)
    is_editable_by_admin = db.Column(db.Boolean, default=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.String(50))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_author = db.Column(db.Boolean, default=False)
    is_patient = db.Column(db.Boolean, default=False)
    recipes = db.relationship('Recipe', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)


@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        app.logger.exception(e)
        return render_template('500.html'), 500


@app.route('/recipe')
def recipes():
    return render_template('recipe.html')


@app.route('/add_recipe', methods=['GET', 'POST'])
@login_required
def add_recipe():
    if request.method == 'POST':
        title = request.form['title']
        instructions = request.form['instructions']
        description = request.form['description']
        servings = request.form['servings']
        author_id = request.form['author_id']
        prep_time = request.form['prep_time']
        cook_time = request.form['cook_time']
        steps = request.form['steps']
        ingredients = request.form['ingredients']
        allergens = request.form['allergens']
        diet_type = request.form['diet_type']
        nutritional_info = request.form['nutritional_info']
        country = request.form['country']
        history = request.form['history']
        recipe = Recipe(title=title, instructions=instructions, description=description, servings=servings,
                        author_id=author_id, prep_time=prep_time, cook_time=cook_time, steps=steps,
                        ingredients=ingredients, allergens=allergens, diet_type=diet_type,
                        nutritional_info=nutritional_info, country=country, history=history)
        db.session.add(recipe)
        db.session.commit()
        flash('Recipe created successfully.')
        return redirect(url_for('recipes'))
    return render_template('add_recipe.html')


@app.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    return render_template('recipe_detail.html', recipe=recipe)


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


@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.route('/author')
def author():
    return render_template('author.html')


@app.route('/patient')
def patient():
    return render_template('patient.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/search_results')
def search_results():
    return render_template('search_results.html')


@app.errorhandler(404)
def page_not_found(e):
    app.logger.error('Page Not Found: %s', e)
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    app.logger.exception('Server Error: %s', e)
    return render_template('500.html'), 500


@app.after_request
def add_header(response):
    response.cache_control.max_age = 86400
    response.cache_control.public = True
    response.cache_control.must_revalidate = True
    response.cache_control.no_store = True
    return response


if __name__ == '__main__':
    app.run(debug=True, port=5000)
