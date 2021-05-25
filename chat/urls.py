from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^create_chatroom', views.create_chatroom, name='create_chatroom'),
    url(r'^chatroom$', views.chatroom, name='chatroom'),
]