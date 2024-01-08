import os
from pathlib import Path

# ...

BASE_DIR = Path(__file__).resolve().parent.parent

# ...

SECRET_KEY = os.getenv('SECRET_KEY', 'hello')

# Modify this based on your database settings
DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': BASE_DIR / 'database.db',
  },
}

ALLOWED_HOSTS = ['*']

# ...
