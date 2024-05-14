from myapp import create_node_app  # Import the create_app function from your package

def run_flask_app():
    app = create_node_app()
    app.run(host='0.0.0.0', port=5000)  # Ensure the Flask app listens on the correct port

if __name__ == "__main__":
    run_flask_app()
