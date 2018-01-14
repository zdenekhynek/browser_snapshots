from django.contrib import admin

from snapshots.models import Snapshot, Session


class SnapshotAdmin(admin.ModelAdmin):
    fields = ('owner', 'agent', 'session', 'url', 'title',
              'source_code', 'image_tag', 'created_at', 'updated_at')
    readonly_fields = ('image_tag', 'created_at', 'updated_at')


# Register your models here.
admin.site.register(Session)
admin.site.register(Snapshot, SnapshotAdmin)
