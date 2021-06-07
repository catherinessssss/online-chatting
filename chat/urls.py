from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^student$', views.student, name='student'),
    url(r'^counsellor$', views.counsellor, name='counsellor'),
    url(r'^subscribe_stream', views.subscribe_stream, name='subscribe_stream'),
    url(r'^unsubscribe_stream', views.unsubscribe_stream, name='unsubscribe_stream'),
    url(r'^delete_stream', views.delete_stream, name='delete_stream'),
    url(r'^stream_room', views.stream_room, name='stream_room'),
]