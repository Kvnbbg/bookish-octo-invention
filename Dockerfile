# Use a base image
FROM python:3.9

# Set working directory in the container
WORKDIR /app

# Copy the application files to the container
COPY . /app

# Install dependencies
RUN pip3 install --upgrade pip3
RUN pip3 install -r requirements.txt  # If you have a requirements.txt file for dependencies

# Set environment variables if needed
ENV FLASK_APP=app.py
ENV FLASK_ENV=development  # Set this to 'production' in production environment

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["flask", "run", "--host=0.0.0.0"]
