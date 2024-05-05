from datetime import datetime

from flask_login import UserMixin # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from werkzeug.security import check_password_hash, generate_password_hash # type: ignore

db = SQLAlchemy()


class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    recipes = db.relationship("Recipe", backref="author", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Recipe(db.Model):
    __tablename__ = "recipe"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255))
    prep_time = db.Column(db.Integer)
    cook_time = db.Column(db.Integer)
    servings = db.Column(db.Integer)
    cuisine = db.Column(db.String(140))
    course = db.Column(db.String(140))
    diet = db.Column(db.String(140))
    occasion = db.Column(db.String(140))
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    source = db.Column(db.String(255))
    url = db.Column(db.String(255))
    notes = db.Column(db.Text)
    confirmed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Recipe {self.title}>"
