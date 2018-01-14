import os

from .base import *

ALLOWED_HOSTS = [
    'browser-snapshots.herokuapp.com'
]

# Update database configuration with $DATABASE_URL.
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)


# Make sure static assets work on heroku
# https://devcenter.heroku.com/articles/django-assets
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Extra places for collectstatic to find static files.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # Simplified static file serving.
    # https://warehouse.python.org/project/whitenoise/
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

#   Setup caching
#   https://www.caktusgroup.com/blog/2014/11/10/Using-Amazon-S3-to-store-your-Django-sites-static-and-media-files/
AWS_S3_OBJECT_PARAMETERS = {
    'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
    'CacheControl': 'max-age=94608000',
}

AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', '')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', '')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')

# Tell django-storages the domain to use to refer to static files.
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

# Tell the staticfiles app to use S3Boto3 storage when writing the collected static files (when
# you run `collectstatic`).
STATICFILES_LOCATION = 'static'
STATICFILES_STORAGE = 'custom_storages.StaticStorage'
MEDIAFILES_LOCATION = 'media'
DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'
