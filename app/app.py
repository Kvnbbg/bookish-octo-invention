from myapp import create_app  # Import the create_app function from your package


def run_flask_app():
    app = create_app()

    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Error running Flask app: {e}")


if __name__ == "__main__":
    run_flask_app()
