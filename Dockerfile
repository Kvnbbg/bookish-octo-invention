# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --upgrade pip && \
  pip install -r requirements.txt

# Set environment variables if needed
# Adjust the line below according to your main Flask application file
ENV FLASK_APP=website

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the application
CMD ["flask", "run", "--host=0.0.0.0"]