import os
import json
from flask_login import LoginManager, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Initialize login manager
login_manager = LoginManager()
login_manager.login_view = "views.login"
login_manager.login_message_category = "info"

# Initialize SQLAlchemy base
Base = declarative_base()

class User(UserMixin, Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(100), nullable=False)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def find_by_username(username, session):
        return session.query(User).filter_by(username=username).first()


class Recipe(Base):
    __tablename__ = 'recipes'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    ingredients = Column(String(500), nullable=False)
    instructions = Column(String(1000), nullable=False)

# Initialize database engine and session for recipes
recipe_engine = create_engine('sqlite:///recipes.db', echo=True)
Base.metadata.create_all(recipe_engine)
RecipeSession = sessionmaker(bind=recipe_engine)

# Initialize database engine and session for users
user_engine = create_engine('sqlite:///users.db', echo=True)
Base.metadata.create_all(user_engine)
UserSession = sessionmaker(bind=user_engine)

class DataManager:
    """
    A class that manages the loading and saving of data.
    """

    @staticmethod
    def load_data(file_path):
        try:
            if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
                with open(file_path, "r") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading data from file '{file_path}': {e}")
        return {}

    @staticmethod
    def save_data(data, file_path):
        try:
            with open(file_path, "w") as f:
                json.dump(data, f)
        except Exception as e:
            print(f"Error saving data to file '{file_path}': {e}")

    @staticmethod
    def load_data_from_db(session, model_class):
        try:
            return session.query(model_class).all()
        except Exception as e:
            print(f"Error loading data from database: {e}")
            return []

    @staticmethod
    def save_data_to_db(session, data):
        try:
            session.add_all(data)
            session.commit()
        except Exception as e:
            print(f"Error saving data to database: {e}")
        finally:
            session.close()

class RecipeDataManager(DataManager):
    """
    A class that manages the loading and saving of recipes.
    """

    @staticmethod
    def load_recipes():
        session = RecipeSession()
        recipes = DataManager.load_data_from_db(session, Recipe)
        session.close()
        return recipes

    @staticmethod
    def save_recipes(recipes):
        session = RecipeSession()
        DataManager.save_data_to_db(session, recipes)

class UserDataManager(DataManager):
    """
    A class that manages the loading and saving of user data.
    """

    @staticmethod
    def load_users():
        session = UserSession()
        users = DataManager.load_data_from_db(session, User)
        session.close()
        return users

    @staticmethod
    def save_users(users):
        session = UserSession()
        DataManager.save_data_to_db(session, users)
