from django.urls import path
from .views import MapSessionView



urlpatterns = [
  path('MapSession/<str:username>/<slug:slug>/', MapSessionView.as_view()), # would be /<uuid:pk>/ if you want the uuid in the URL
]