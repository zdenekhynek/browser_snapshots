"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""

import os
import django
from channels.routing import get_default_application

APP_ENV = os.environ.get('APP_ENV', 'development')
SETTINGS_MODULE = '.'.join(['browser_snapshots', 'settings', APP_ENV])

os.environ.setdefault('DJANGO_SETTINGS_MODULE', SETTINGS_MODULE)
django.setup()
application = get_default_application()
