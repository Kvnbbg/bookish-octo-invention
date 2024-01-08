import os
from flask import Flask
from flask.cli import FlaskGroup
from website import app, db  # Import your Flask app and db object here

cli = FlaskGroup(app)

# Custom CLI command to initialize the database
@cli.command('initdb')
def initdb():
    """Initialize the database."""
    # Drop all tables and recreate
    db.drop_all()
    db.create_all()
    # Add default data if needed
    # Your initialization logic here
    print('Database initialized successfully.')

if __name__ == '__main__':
    cli()
