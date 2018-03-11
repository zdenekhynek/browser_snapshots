from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse

from snapshots.models import Snapshot, Session
from snapshots.pagination import PaginatedInline


def get_video_link(id):
        return reverse('admin:youtube_video_change', args=[id])


def get_video_tag(video):
    link = get_video_link(video.id)
    title = video.title
    return mark_safe('<a href="%s">%s</a>' % (link, title))


def get_related_video_tags(related_videos):
    videos = []
    for related_video in related_videos.all():
        videos.append(get_video_tag(related_video))
    return mark_safe('<ul>%s</ul>' % ' '.join(videos))


class SnapshotAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        image_url = obj.image.url
        return mark_safe('<img src="%s" style="max-width:800px;height:auto;" />' % image_url)

    image_tag.short_description = 'Image'

    def video_tag(self, obj):
        return get_video_tag(obj.video)

    video_tag.short_description = 'Video'

    def next_up_video_tag(self, obj):
        return get_video_tag(obj.next_up_video)

    next_up_video_tag.short_description = 'Next up video'

    def related_videos_tag(self, obj):
        return get_related_video_tags(obj.related_videos)

    related_videos_tag.short_description = 'Related videos'

    fields = ('owner', 'agent', 'session', 'url', 'title',
              'source_code', 'image_tag', 'video_tag', 'next_up_video_tag',
              'related_videos_tag', 'created_at', 'updated_at')
    readonly_fields = ('image_tag', 'created_at', 'updated_at',
                       'video_tag', 'next_up_video_tag', 'related_videos_tag')

    list_filter = ('agent', 'owner')


class SnaphostInline(PaginatedInline):
    def thumbnail_tag(self, obj):
        image_url = obj.image.url
        return mark_safe(
            '<img src="%s" style="max-width:300px;height:auto;" />' % image_url
        )

    thumbnail_tag.short_description = 'Image'

    def link_tag(self, obj):
        link = reverse('admin:snapshots_snapshot_change', args=[obj.id])
        return mark_safe('<a href="%s">Snapshot detail</a>' % link)

    link_tag.short_description = 'Link'

    def video_tag(self, obj):
        return get_video_tag(obj.video)

    video_tag.short_description = 'Video'

    def next_up_video_tag(self, obj):
        return get_video_tag(obj.next_up_video)

    next_up_video_tag.short_description = 'Next up video'

    def related_videos_tag(self, obj):
        return get_related_video_tags(obj.related_videos)

    related_videos_tag.short_description = 'Related videos'

    model = Snapshot
    fields = ('url', 'title', 'thumbnail_tag', 'link_tag', 'video_tag',
              'next_up_video_tag', 'related_videos_tag', 'created_at')
    readonly_fields = ('created_at', 'thumbnail_tag', 'link_tag',
                       'video_tag', 'next_up_video_tag', 'related_videos_tag')


class SessionAdmin(admin.ModelAdmin):
    fields = ('owner', 'agent', 'start', 'end', 'lat',
              'lng', 'comments')
    readonly_fields = ('start', 'end')

    inlines = [
        SnaphostInline,
    ]

    list_display = ['start', 'agent', 'owner', 'comments']

    # def get_name(self, obj):
    #     return obj.author.name

    # get_name.admin_order_field  = 'author'  #Allows column order sorting
    # get_name.short_description = 'Author Name'  #Renames column head


# Register your models here.
admin.site.register(Session, SessionAdmin)
admin.site.register(Snapshot, SnapshotAdmin)
