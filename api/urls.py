from django.conf.urls import include, url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

from .views import CreateSnapshotView, DetailsSnapshotView, CreateSessionView, DetailsSessionView, CreateAgentsView, CreateScenariosView

urlpatterns = {
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^agents/$', CreateAgentsView.as_view(),
        name='create_agents'),
    url(r'^scenarios/$', CreateScenariosView.as_view(),
        name='create_scenarios'),
    url(r'^snapshots/$', CreateSnapshotView.as_view(),
        name='create_snapshots'),
    url(r'^snapshots/(?P<pk>[0-9]+)/$',
        DetailsSnapshotView.as_view(), name='details_snapshots'),
    url(r'^sessions/$', CreateSessionView.as_view(), name='create_session'),
    url(r'^sessions/(?P<pk>[0-9]+)/$',
        DetailsSessionView.as_view(), name='details_session'),
    url(r'^get-token/', obtain_auth_token),
}

urlpatterns = format_suffix_patterns(urlpatterns)
