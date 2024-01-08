import os
import sys

def main():
  # Set the DJANGO_SETTINGS_MODULE environment variable
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')

  try:
    # Import the django module
    import django
  except ImportError as exc:
    raise ImportError(
      "Couldn't import Django. Are you sure it's installed and "
      "available on your PYTHONPATH environment variable? Did you "
      "forget to activate a virtual environment?"
    ) from exc

  # Run the django-admin command to generate the project
  django.setup()
  from django.core.management import execute_from_command_line
  execute_from_command_line(sys.argv)

if __name__ == '__main__':
  main()
