from myapp import create_node_app  # Import the create_app function from your package


def run_flask_app():
    app = create_node_app()
    
if __name__ == "__main__":
    run_flask_app()
