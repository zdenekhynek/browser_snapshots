"""
WSGI config for browser_snapshots project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

APP_ENV = os.environ.get('APP_ENV', 'development')
SETTINGS_MODULE = '.'.join(['browser_snapshots', 'settings', APP_ENV])

os.environ.setdefault('DJANGO_SETTINGS_MODULE', SETTINGS_MODULE)

application = get_wsgi_application()
