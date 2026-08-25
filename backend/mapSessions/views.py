from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import MapSession
from .serializers import MapSessionListSerializer, MapSessionDetailSerializer, MapSessionWriteSerializer

User = get_user_model()



class MapSessionListView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  # Purpose: Returns basic info for every session belonging to a user, for the session list page
  # Input: GET /api/mapSessions/list/<username>/
  # Output: JSON array of { slug, title, map_selected, all_can_edit, last_updated }
  def get(self, request, username):
    owner = get_object_or_404(User, username=username)
    sessions = owner.sessions.all()
    serializer = MapSessionListSerializer(sessions, many=True)
    return Response(serializer.data, status=200)
  
  # Purpose: Creates a new session owned by the given user
  # Input: POST /api/mapSessions/list/<username>/ with { title, map_selected, all_can_edit, sessionInfo }
  # Output: JSON of the created session on 201; 403 if requester is not the owner
  def post(self, request, username):
    owner = get_object_or_404(User, username=username)
    if request.user != owner: # not the owner, then stop!
      return Response(status=403)
    serializer = MapSessionWriteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(user=owner)
    return Response(serializer.data, status=201)




class MapSessionDetailView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  # Purpose: Returns full session detail incl. permitted_to_edit, fetched when a user clicks the edit button
  # Input: GET /api/mapSessions/MapSession/<username>/<slug>/
  # Output: JSON with { slug, title, map_selected, all_can_edit, permitted_to_edit, sessionInfo, created_at, last_updated }
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = MapSessionDetailSerializer(session)
    return Response(serializer.data, status=200)
  

  # Purpose: Partially updates an existing session owned by the given user
  # Input: PATCH /api/mapSessions/MapSession/<username>/<slug>/ with any subset of { title, map_selected, all_can_edit, sessionInfo }
  # Output: JSON of the updated session on 200; 403 if requester is not the owner
  def patch(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug) # fetches record from db where user and slug match
    if request.user != session.user: # not the owner, then stop!
      return Response(status=403)
    serializer = MapSessionWriteSerializer(session, data=request.data, partial=True) # serializer is constructed with three arguements
    # session: the existing db object to update, data=request.data: the incoming JSON from frontend, partial=True: makes it a PATCH, not a PUT so not al fields are required.  frontend can send only { "title": "New Title" } without needing to resend map_selected, all_can_edit, and sessionInfo as well
    serializer.is_valid(raise_exception=True) # runs all the alidation logic in MapSessionWriteSerializer, including validate_map_selected() which does the string to int conversion.
    serializer.save()
    return Response(serializer.data, status=200)
  
  
  def delete(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    if request.user != session.user:
        return Response(status=403)
    session.delete()
    return Response(status=204)