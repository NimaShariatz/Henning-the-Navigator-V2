from django.urls import re_path
from .consumers import MapSessionConsumer

websocket_urlpatterns = [
    re_path(r'ws/mapSessions/(?P<username>[\w.@+-]+)/(?P<slug>[-\w]+)/$', MapSessionConsumer.as_asgi()),
]