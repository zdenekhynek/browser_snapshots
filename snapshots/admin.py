from django.contrib import admin

from snapshots.models import Snapshot, Session

# Register your models here.
admin.site.register(Session)
admin.site.register(Snapshot)
