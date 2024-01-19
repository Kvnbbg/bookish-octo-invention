# __init__.py 
from flask import Flask

def create_app():
    app = Flask(__name__)

    # Import views here to avoid circular import
    from myapp.views import views_bp
    app.register_blueprint(views_bp)
    print("views_bp registered")
    return app

app = create_app()

if create_app == True:
    print("App created successfully.")

