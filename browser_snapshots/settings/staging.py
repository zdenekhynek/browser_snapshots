from .base import *

ALLOWED_HOSTS = [
    'browser-snapshots.herokuapp.com'
]

# Update database configuration with $DATABASE_URL.
import dj_database_url
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
