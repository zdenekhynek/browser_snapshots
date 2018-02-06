from django.conf import settings
from django.contrib.admin.views.main import ChangeList
from django.core.paginator import EmptyPage, InvalidPage, Paginator
from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse

from snapshots.models import Snapshot, Session


class SnapshotAdmin(admin.ModelAdmin):
    def image_tag(self, obj):
        image_url = obj.image.url
        return mark_safe('<img src="%s" style="max-width:800px;height:auto;" />' % image_url)

    image_tag.short_description = 'Image'

    fields = ('owner', 'agent', 'session', 'url', 'title',
              'source_code', 'image_tag', 'created_at', 'updated_at')
    readonly_fields = ('image_tag', 'created_at', 'updated_at')

    list_filter = ('agent', 'owner')


class InlineChangeList(object):
    can_show_all = True
    multi_page = True
    get_query_string = ChangeList.__dict__['get_query_string']

    def __init__(self, request, page_num, paginator):
        self.show_all = 'all' in request.GET
        self.page_num = page_num
        self.paginator = paginator
        self.result_count = paginator.count
        self.params = dict(request.GET.items())


class SnaphostInline(admin.StackedInline):
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

    extra = 0
    per_page = 2
    template = 'admin/edit_inline/stacked.html'

    def get_formset(self, request, obj=None, **kwargs):
        formset_class = super(SnaphostInline, self).get_formset(
            request, obj, **kwargs)

        class PaginationFormSet(formset_class):
            def __init__(self, *args, **kwargs):
                super(PaginationFormSet, self).__init__(*args, **kwargs)

                qs = self.queryset
                paginator = Paginator(qs, self.per_page)

                try:
                    page_num = int(request.GET.get('p', '0'))
                except ValueError:
                    page_num = 0

                try:
                    page = paginator.page(page_num + 1)
                except (EmptyPage, InvalidPage):
                    page = paginator.page(paginator.num_pages)

                self.cl = InlineChangeList(request, page_num, paginator)
                self.paginator = paginator

                if self.cl.show_all:
                    self._queryset = qs
                else:
                    self._queryset = page.object_list

                self.page_num = page_num + 1

                self.has_previous = self.page_num > 1
                self.has_next = self.page_num < paginator.num_pages

                self.previous_page_number = page_num - 1
                self.next_page_number = page_num + 1

        PaginationFormSet.per_page = self.per_page
        return PaginationFormSet


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
