from flask_wtf import FlaskForm, FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, TextAreaField, IntegerField, PasswordField, SubmitField, SelectField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo, Length, NumberRange, ValidationError
from myapp.models import User
from flask_login import current_user


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')  # Allows users to stay logged in
    submit = SubmitField('Log In')

    def validate_username(self, username):
        # Optional: Add additional validation to check if the username exists in the database
        user = User.query.filter_by(username=username.data).first()
        if not user:
            raise ValidationError('No account found with this username. Please register first.')



class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    role = SelectField('Role', choices=[('admin', 'Admin'), ('patient', 'Patient')], validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is already taken. Please choose a different one.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is already in use. Please choose a different one.')


class RecipeForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    ingredients = TextAreaField('Ingredients', validators=[DataRequired()])
    instructions = TextAreaField('Instructions', validators=[DataRequired()])
    image = FileField('Recipe Image', validators=[FileAllowed(['jpg', 'png'], 'Images only!')])
    prep_time = IntegerField('Preparation Time (minutes)', validators=[DataRequired(), NumberRange(min=1)])
    cook_time = IntegerField('Cooking Time (minutes)', validators=[DataRequired(), NumberRange(min=1)])
    servings = IntegerField('Servings', validators=[DataRequired(), NumberRange(min=1)])
    cuisine = SelectField('Cuisine', choices=[('Italian', 'Italian'), ('Mexican', 'Mexican'), ('Indian', 'Indian')], validators=[DataRequired()])
    course = SelectField('Course', choices=[('Main', 'Main Course'), ('Dessert', 'Dessert'), ('Appetizer', 'Appetizer')], validators=[DataRequired()])
    diet = SelectField('Diet', choices=[('Vegetarian', 'Vegetarian'), ('Vegan', 'Vegan'), ('Gluten-Free', 'Gluten-Free')], validators=[DataRequired()])
    occasion = StringField('Occasion', validators=[DataRequired()])
    author = StringField('Author', validators=[DataRequired()])
    source = StringField('Source', validators=[DataRequired()])
    url = StringField('URL', validators=[DataRequired()])
    notes = TextAreaField('Notes')
    submit = SubmitField('Submit Recipe')