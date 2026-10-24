from django.urls import path
from .views import MapSessionListView, MapSessionDetailView, WaypointListView, WaypointDetailView, TargetListView, TargetDetailView, TextListView, TextDetailView, FrontlineListView, SessionImportView, SessionVersionView

urlpatterns = [
  path('list/<str:username>/', MapSessionListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/', MapSessionDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/waypoints/', WaypointListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/waypoints/<int:local_id>/', WaypointDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/targets/', TargetListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/targets/<int:local_id>/', TargetDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/texts/', TextListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/texts/<int:local_id>/', TextDetailView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/frontlines/', FrontlineListView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/import/', SessionImportView.as_view()),
  path('MapSession/<str:username>/<slug:slug>/version/', SessionVersionView.as_view()),
]