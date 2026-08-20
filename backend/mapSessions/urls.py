from django.urls import path
from .views import MapSessionListView, MapSessionDetailView

urlpatterns = [
  path('list/<str:username>/', MapSessionListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/', MapSessionDetailView.as_view()),
]