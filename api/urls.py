from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from .views import CreateSnapshotView, DetailsSnapshotView, CreateSessionView, DetailsSessionView

urlpatterns = {
    url(r'^snapshots/$', CreateSnapshotView.as_view(), name="create"),
    url(r'^snapshots/(?P<pk>[0-9]+)/$',
        DetailsSnapshotView.as_view(), name="details"),
    url(r'^sessions/$', CreateSessionView.as_view(), name="create_session"),
    url(r'^sessions/(?P<pk>[0-9]+)/$',
        DetailsSessionView.as_view(), name="details_session"),
}

urlpatterns = format_suffix_patterns(urlpatterns)
