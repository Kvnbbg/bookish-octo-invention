# __init__.py 
from myapp.views import views_bp
from flask import Flask


def create_app():
  app = Flask(__name__)
  from myapp.views import views_bp
  app.register_blueprint(views_bp)
  print("views_bp registered by __init__.py")
  
  return app

