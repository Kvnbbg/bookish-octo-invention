import os
import secrets


class Config:
    # Application configuration settings
    SESSION_TYPE = 'filesystem'

    # Database Configuration
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_USER = os.environ.get('DB_USER', 'your_database_user')
    DB_PASSWORD = os.environ.get('DB_PASSWORD') or secrets.token_urlsafe(32)
    DB_NAME = os.environ.get('DB_NAME', 'your_database_name')
    
    # Secret Key Generation
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    
    # Additional Parameters
    ADDITIONAL_PARAM1 = SECRET_KEY
    
    PASSWORD = os.environ.get('APP_PASSWORD') or secrets.token_urlsafe(16)
    ADDITIONAL_PARAM2 = PASSWORD
    
    # OpenAI API Key
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    # File Paths
    USERS_FILE = 'users.db'
    RECIPES_FILE = 'recipes.db'
    
    # Debug Mode
    DEBUG = True


# Function to automatically update .zshrc
def update_zshrc():
    config_vars = [
        ("DB_HOST", Config.DB_HOST),
        ("DB_USER", Config.DB_USER),
        ("DB_PASSWORD", Config.DB_PASSWORD),
        ("DB_NAME", Config.DB_NAME),
        ("SECRET_KEY", Config.SECRET_KEY),
        ("APP_PASSWORD", Config.PASSWORD),
        ("OPENAI_API_KEY", Config.OPENAI_API_KEY)
    ]
    
    zshrc_path = os.path.expanduser("~/.zshrc")
    
    with open(zshrc_path, "a") as zshrc:
        zshrc.write("\n# Automatically added by your Flask app\n")
        for var, value in config_vars:
            zshrc.write(f"export {var}='{value}'\n")
    
    print(f"Configuration added to {zshrc_path}. Please restart your shell or run `source {zshrc_path}`.")


# Automatic Configuration for .zshrc
if __name__ == "__main__":
    update_zshrc()
