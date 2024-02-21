# myapp/config.py
import os
import secrets

class Config:
    # Base configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    SESSION_TYPE = 'filesystem'
        
    # Additional Parameters
    ADDITIONAL_PARAM1 = SECRET_KEY
    
    PASSWORD = os.environ.get('APP_PASSWORD') or secrets.token_urlsafe(16)
    ADDITIONAL_PARAM2 = PASSWORD
    
    # OpenAI API Key
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    # File Paths of database
    USERS_FILE = 'users.db'
    RECIPES_FILE = 'recipes.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'default_app.db')
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'noreply@kvnbbg-creations.io'
    BABEL_DEFAULT_LOCALE = 'en'
    LANGUAGES = ['en', 'fr']
    DEBUG = False

    # Add other global settings here

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'dev_app.db')
    # Development-specific settings

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///:memory:'
    # Testing-specific settings

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    # Production-specific settings
    DEBUG = False

def update_zshrc():
    config_vars = [
        ("SECRET_KEY", Config.SECRET_KEY),
        ("DATABASE_URL", Config.SQLALCHEMY_DATABASE_URI),
        ("MAIL_USERNAME", Config.MAIL_USERNAME),
        ("MAIL_PASSWORD", Config.MAIL_PASSWORD),
    ]

    zshrc_path = os.path.expanduser("~/.zshrc")

    with open(zshrc_path, "a") as zshrc:
        zshrc.write("\n# Automatically added by your Flask app\n")
        for var, value in config_vars:
            zshrc.write(f"export {var}='{value}'\n")

    print(f"Configuration added to {zshrc_path}. Please restart your shell or run `source {zshrc_path}`.")