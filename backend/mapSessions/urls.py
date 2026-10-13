from django.urls import path
from .views import MapSessionListView, MapSessionDetailView, WaypointListView, WaypointDetailView, TargetListView, TargetDetailView

urlpatterns = [
  path('list/<str:username>/', MapSessionListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/', MapSessionDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/waypoints/', WaypointListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/waypoints/<int:local_id>/', WaypointDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/targets/', TargetListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/targets/<int:local_id>/', TargetDetailView.as_view()),
]