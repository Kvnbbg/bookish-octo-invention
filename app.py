from flask import Flask

# app.py

"""
This is the main module of the application.
"""

app = Flask(__name__, instance_relative_config=True)

login_manager.init_app(app)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)



