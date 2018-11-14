from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^images/(?P<agent_id>[0-9]+)/$', views.images, name='images'),
    url(r'^thumbs/(?P<agent_id>[0-9]+)/$', views.thumbs, name='thumbs'),
    url(r'^titles/(?P<agent_id>[0-9]+)/$', views.titles, name='titles'),
    url(r'^sessions/(?P<agent_id>[0-9]+)/$', views.sessions, name='sessions'),
    # url(r'', views.index, name='index'),
]
