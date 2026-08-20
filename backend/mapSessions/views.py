from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import MapSession
from .serializers import MapSessionListSerializer, MapSessionDetailSerializer

User = get_user_model()


# Purpose: Returns basic info for every session belonging to a user, for the session list page
# Input: GET /api/mapSessions/list/<username>/
# Output: JSON array of { slug, title, map_selected, all_can_edit, last_updated }
class MapSessionListView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request, username):
    owner = get_object_or_404(User, username=username)
    sessions = owner.sessions.all()
    serializer = MapSessionListSerializer(sessions, many=True)
    return Response(serializer.data, status=200)


# Purpose: Returns full session detail incl. permitted_to_edit, fetched when a user clicks "Enter Session"
# Input: GET /api/mapSessions/MapSession/<username>/<slug>/
# Output: JSON with { slug, title, map_selected, all_can_edit, permitted_to_edit, sessionInfo, created_at, last_updated }
class MapSessionDetailView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = MapSessionDetailSerializer(session)
    return Response(serializer.data, status=200)