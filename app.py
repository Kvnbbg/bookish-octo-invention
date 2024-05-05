import socket
import sys

from myapp import create_app  # Import the create_app function from your package


def find_available_port(start_port=5000, max_attempts=10):
    """
    Find an available port within a range of attempts.
    """
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
                return port  # Successfully bound to an available port
        except OSError as e:
            if e.errno != 98:  # Address already in use
                raise  # Reraise exceptions that are not related to port already being in use

    sys.exit("Error: Unable to find an available port within the specified range.")


def run_flask_app():
    app = create_app()

    # Find an available port
    port = find_available_port()

    try:
        # Run the Flask app on the available port with debug enabled
        app.run(port=port, debug=True)
    except Exception as e:
        print(f"Error running Flask app: {e}")


if __name__ == "__main__":
    run_flask_app()
