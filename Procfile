web: daphne browser_snapshots.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: newrelic-admin run-program python manage.py runworker -v2
