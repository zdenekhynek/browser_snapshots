from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^images/(?P<agent_id>[0-9]+)/$', views.images, name='images'),
    url(r'^titles/(?P<agent_id>[0-9]+)/$', views.titles, name='titles'),
   # url(r'^', views.index, name='index'),
]
