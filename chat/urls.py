from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^subscribe_stream', views.subscribe_stream, name='subscribe_stream'),
    url(r'^unsubscribe_stream', views.unsubscribe_stream, name='unsubscribe_stream'),
    url(r'^delete_stream', views.delete_stream, name='delete_stream'),
    url(r'^join_stream_room', views.join_stream_room, name='join_stream_room'),

]