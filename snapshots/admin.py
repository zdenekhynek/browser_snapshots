from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse

from snapshots.models import Snapshot, Session
from snapshots.pagination import InlineChangeList, PaginatedInline


class SnapshotAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        image_url = obj.image.url
        return mark_safe('<img src="%s" style="max-width:800px;height:auto;" />' % image_url)

    image_tag.short_description = 'Image'

    fields = ('owner', 'agent', 'session', 'url', 'title',
              'source_code', 'image_tag', 'created_at', 'updated_at')
    readonly_fields = ('image_tag', 'created_at', 'updated_at')

    list_filter = ('agent', 'owner')


class SnaphostInline(PaginatedInline):
    def thumbnail_tag(self, obj):
        image_url = obj.image.url
        return mark_safe('<img src="%s" style="max-width:300px;height:auto;" />' % image_url)

    thumbnail_tag.short_description = 'Image'

    def link_tag(self, obj):
        link = reverse('admin:snapshots_snapshot_change', args=[obj.id])
        return mark_safe('<a href="%s">Snapshot detail</a>' % link)

    link_tag.short_description = 'Link'

    model = Snapshot
    fields = ('url', 'title', 'thumbnail_tag', 'link_tag', 'created_at')
    readonly_fields = ('created_at', 'thumbnail_tag', 'link_tag')


class SessionAdmin(admin.ModelAdmin):
    fields = ('owner', 'agent', 'start', 'end', 'lat',
              'lng')
    readonly_fields = ('start', 'end')

    inlines = [
        SnaphostInline,
    ]

    list_display = ['start', 'agent', 'owner']

    # def get_name(self, obj):
    #     return obj.author.name

    # get_name.admin_order_field  = 'author'  #Allows column order sorting
    # get_name.short_description = 'Author Name'  #Renames column head


# Register your models here.
admin.site.register(Session, SessionAdmin)
admin.site.register(Snapshot, SnapshotAdmin)
