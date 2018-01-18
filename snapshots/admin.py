from django.conf import settings
from django.contrib import admin
from django.utils.safestring import mark_safe

from snapshots.models import Snapshot, Session


class SnapshotAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        image_url = obj.image
        return mark_safe('<img src="/%s" style="max-width:800px;height:auto;" />' % image_url)

    image_tag.short_description = 'Image'

    fields = ('owner', 'agent', 'session', 'url', 'title',
              'source_code', 'image_tag', 'created_at', 'updated_at')
    readonly_fields = ('image_tag', 'created_at', 'updated_at')

    list_filter = ('agent', 'owner')


class SnaphostInline(admin.StackedInline):
    def thumbnail_tag(self, obj):
        image_url = obj.image
        final_image_url = settings.MEDIA_URL + str(image_url)
        return mark_safe('<img src="/%s" style="max-width:300px;height:auto;" />' % final_image_url)

    thumbnail_tag.short_description = 'Image'

    model = Snapshot
    fields = ('url', 'title', 'thumbnail_tag', 'created_at')
    readonly_fields = ('created_at', 'thumbnail_tag')


class SessionAdmin(admin.ModelAdmin):
    fields = ('owner', 'agent', 'start', 'end', 'lat',
              'lng')
    readonly_fields = ('start', 'end')

    inlines = [
        SnaphostInline,
    ]


# Register your models here.
admin.site.register(Session, SessionAdmin)
admin.site.register(Snapshot, SnapshotAdmin)
