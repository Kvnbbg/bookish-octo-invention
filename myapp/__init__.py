import os
from flask import Flask
from myapp.views import views_bp

def create_app():
    app = Flask(__name__)

    try:
        configure_app(app)
        register_blueprints(app)
        return app

    except Exception as e:
        handle_error(e)
        return app

def configure_app(app):
    try:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        config_path = os.path.join(base_dir, "config.py")
        app.config.from_pyfile(config_path)

        # Set the secret key
        app.secret_key = app.config["ADDITIONAL_PARAM1"]
        print("Additional param 1 is set by __init__.py")

    except Exception as e:
        handle_error(e)

def register_blueprints(app):
    try:
        app.register_blueprint(views_bp)
        print("Blueprint registered by __init__.py")

    except Exception as e:
        handle_error(e)

def handle_error(error):
    print(f"Error: {error}")
    # Optionally, you can log the error using a logging library
    print(f"Error details: {error}", exc_info=True)

# If __name__ == "__main__":
#     create_app().run()
