from flask import Flask, render_template, request, redirect, url_for, flash 
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required
import logging  
logging.basicConfig(filename='error.log', level=logging.DEBUG)  
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
from datetime import datetime 
from werkzeug.security import generate_password_hash

## APP CONFIGURATION ##
app = Flask(__name__)  # Create a new instance of the Flask class called "app"
app.logger.setLevel('INFO')  # Set the log level to INFO
app.secret_key = 'hello'  # Set the secret key to some random bytes. Keep this really secret!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recipes.db'  # Path to database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Silence the deprecation warning

## DATABASE CONFIGURATION ##
db = SQLAlchemy(app) # Instantiate the database obje
def create_tables():
    db.create_all()

## LOGIN CONFIGURATION ##
login_manager = LoginManager() # Instantiate a LoginManager object 

@login_manager.user_loader # Create a user_loader callback function
def load_user(user_id): # Accepts a user ID and returns the corresponding user object
    return User.query.get(int(user_id)) # Returns the user object or None

login_manager.init_app(app) # Configure it for our Flask application
SESSION = 'my_session' # Set the session name

## CLASS DEFINITIONS ##
# Define your models below
class Recipe(db.Model): # Define a recipe model by extending the db.Model class 
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy 
    title = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes 
    # image = db.Column(db.image) # Column definitions are bound to model attributes 
    instructions = db.Column(db.Text) # Column definitions are bound to model attributes 
    description = db.Column(db.Text) # Column definitions are bound to model attributes 
    servings = db.Column(db.Integer) # Column definitions are bound to model attributes 
    created_at = db.Column(db.DateTime, default=datetime.utcnow) # replace date_createed with created_at
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

class Ingredient(db.Model): # Define a Ingredient model by extending the db.Model class 
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy 
    name = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes
    quantity = db.Column(db.String(50))
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)

class User(UserMixin, db.Model): # Define a User model by extending the db.Model class
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy
    username = db.Column(db.String(50), unique=True, nullable=False) # Column definitions are bound to model attributes
    email = db.Column(db.String(100), unique=True, nullable=False) # Column definitions are bound to model attributes
    password = db.Column(db.String(100), nullable=False) # Column definitions are bound to model attributes
    is_admin = db.Column(db.Boolean, default=False) # Column definitions are bound to model attributes
    is_author = db.Column(db.Boolean, default=False) # Column definitions are bound to model attributes
    is_patient = db.Column(db.Boolean, default=False) # Column definitions are bound to model attributes
    recipes = db.relationship('Recipe', backref='user', lazy=True) # Define a one-to-many relationship between User and Recipe models
    def __repr__(self):
        return '<User %r>' % self.username



class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True) # Primary keys are required by SQLAlchemy
    name = db.Column(db.String(50), unique=True, nullable=False) # Column definitions are bound to model attributes!!!!!!

## ROUTES ##
# Define the routes for your application below
@app.route('/') # Home page route - displays nav bar, search bar, section about and my services
def index(): 
    try:
        return render_template('index.html') # Render the template located in /templates/index.html
    except Exception as e:
        app.logger.error('An error occurred: %s', (e))
        return render_template('500.html'), 500

@app.route('/recipe') # Recipes page route - displays all recipes creations from the administrator
def recipes(): 
    return render_template('recipe.html') # Render the template located in /templates/recipe.html

@app.route('/add_recipe', methods=['GET', 'POST']) # Recipe create page route - displays a form for the administrator to create a recipe
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
        recipe = Recipe(title=title, instructions=instructions, description=description, servings=servings, author_id=author_id, prep_time=prep_time, cook_time=cook_time, steps=steps, ingredients=ingredients, allergens=allergens, diet_type=diet_type, nutritional_info=nutritional_info, country=country, history=history)
        db.session.add(recipe)
        db.session.commit()
        flash('Recipe created successfully.')
        return redirect(url_for('recipes'))
    return render_template('add_recipe.html')

@app.route('/recipe/<int:recipe_id>') # Recipe page route - displays a single recipe creation from the administrator
def recipe_detail(recipe_id): # View recipe detail page
    recipe = Recipe.query.get_or_404(recipe_id) # Get the recipe with the primary key equal to recipe_id or return 404
    return render_template('recipe_detail.html', recipe=recipe) # Render the template located in /templates/recipe_detail.html

@app.route('/authentification') # Login page route - displays login form for the administrator, author or  patient
def authentication(): 
    return render_template('authentification.html')

# LOGIN AND REGISTRATION ROUTES
@app.route('/login', methods=['GET', 'POST']) # Login page route - displays login form
def login(): 
    # logic for login page goes here
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # logic for checking username and password goes here
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            login_user(user)
            flash('Logged in successfully.')
            return redirect(url_for('profile'))
        else:
            flash('Invalid username/password combination.')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout') # Logout page route - displays logout form
@login_required
def logout(): 
    logout_user()
    flash('Logged out successfully.')
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST']) # Register page route - displays register form for the administrator, author or  patient
def register():
    # logic for register page goes here
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # logic for checking username and password goes here
        existing_user = User.query.filter_by(db.or_(User.username == username, User.email == email)).first()
        if existing_user:  # if a user is found, we want to redirect back to signup page so user can try again
            flash('Username already exists.')
            return redirect(url_for('register'))
        else:
         # create new user
            hashed_password = generate_password_hash(password)
            new_user = User(username=username, email=email, password=hashed_password)
            # add new user to database
            db.session.add(new_user)
            db.session.commit()
            flash('User created successfully.')
            # Redirect to login page here or a success page
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@app.route('/admin') # Admin page route - displays admin form for the administrator
def admin(): 
    return render_template('admin.html')

@app.route('/author') # Author page route - displays author form for the author
def author(): 
    return render_template('author.html')

@app.route('/patient') # Patient page route - displays patient form for the patient
def patient(): 
    return render_template('patient.html')

@app.route('/about') # About page route - displays about form for the administrator, author or  patient
def about(): 
    return render_template('about.html')

@app.route('/contact') # Contact page route - displays contact form for the administrator, author or  patient
def contact(): 
    return render_template('contact.html')

@app.route('/search') # Search page route - displays search form for the administrator, author or  patient
def search(): 
    return render_template('search.html')

@app.route('/search_results') # Search results page route - displays search results form for the administrator, author or  patient
def search_results(): 
    return render_template('search_results.html')

@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
    app.logger.error('Page Not Found: %s', (e))
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    # note that we set the 500 status explicitly
    app.logger.error('Server Error: %s', (e))
    return render_template('500.html'), 500

def create_tables():
    db.create_all()

if __name__ == '__main__': # Runs the application 
    create_tables()
    app.run(debug=True, port=5000) # Run the app in debug mode on port 5000
