from sqlalchemy import Column, Integer, String, DateTime, func, Boolean
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import sessionmaker

# Initialize SQLAlchemy
db = SQLAlchemy()

class User(UserMixin, db.Model):
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


class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)
    cooking_time = Column(Integer, nullable=False)
    resting_time = Column(Integer, nullable=False)
    diet = Column(String(50), nullable=False)
    patient_name = Column(String(50), nullable=False)
    dietitian_name = Column(String(50), nullable=False)
    ingredients = Column(String(1000), nullable=False)
    preparation_time = Column(Integer, nullable=False)
    instructions = Column(String(2000), nullable=False)
    allergens = Column(String(200), nullable=True)
    vegetarian = Column(Boolean, default=False)
    lactose_free = Column(Boolean, default=False)
    salt_free = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


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
        session = Session()
        recipes = DataManager.load_data_from_db(session, Recipe)
        session.close()
        return recipes

    @staticmethod
    def save_recipes(recipes):
        session = Session()
        DataManager.save_data_to_db(session, recipes)


class UserDataManager(DataManager):
    """
    A class that manages the loading and saving of user data.
    """

    @staticmethod
    def load_users():
        session = Session()
        users = DataManager.load_data_from_db(session, User)
        session.close()
        return users

    @staticmethod
    def save_users(users):
        session = Session()
        DataManager.save_data_to_db(session, users)
