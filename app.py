# app.py
from myapp import create_app
import socket
import sys

def find_available_port(start_port=5000, max_attempts=10):
    """
    Find an available port within a range of attempts.
    """
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(("127.0.0.1", port))
            return port
        except OSError as e:
            if e.errno != 98:  # Address already in use
                raise

    sys.exit("Error: Unable to find an available port.")

if __name__ == "__main__":
    app = create_app()

    # Find an available port
    port = find_available_port()

    try:
        app.run(port=port, debug=True)
    except Exception as e:
        print(f"Error: {e}")
