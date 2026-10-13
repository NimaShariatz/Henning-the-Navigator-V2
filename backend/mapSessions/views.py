from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import models, transaction
from .models import MapSession, Waypoint, Target, Text, Frontline
from .serializers import MapSessionListSerializer, MapSessionDetailSerializer, MapSessionWriteSerializer, WaypointSerializer, TargetSerializer, TextSerializer, FrontlineSerializer
from rest_framework.exceptions import PermissionDenied


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
    serializer = MapSessionWriteSerializer(data=request.data, context={'user': owner}) # for the context= the serializer doesnt know the user so pass it to the serializer
    serializer.is_valid(raise_exception=True)
    serializer.save(user=owner)
    return Response(serializer.data, status=201)




class MapSessionDetailView(APIView):
  def get_permissions(self): # if its GET, its fine. But if its anything else, user MUST be logged in so get_session_for_edit() can do its thing.
    if self.request.method == 'GET':
      return [permissions.AllowAny()]
    return [permissions.IsAuthenticated()]

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
  
  # Purpose: delete the session owned by the given user
  # Input: DELETE /api/mapSessions/MapSession/<username>/<slug>/
  # Output: session deleted. all targets, waypoints, texts, and frontlines deleted by cascade as well
  def delete(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    if request.user != session.user:
        return Response(status=403)
    session.delete()
    return Response(status=204)
  
# Purpose: if the user is allowed 
def get_session_for_edit(request, username, slug):
  session = get_object_or_404(MapSession, user__username=username, slug=slug)
  user = request.user
  can_edit = session.all_can_edit or user == session.user or session.permitted_to_edit.filter(pk=user.pk).exists()
  if not can_edit:
    raise PermissionDenied()
  return session







class WaypointListView(APIView):
  # WaypointListView does not take in a <local_id>. Not needed for GET and POST
  permission_classes = [permissions.AllowAny]

  # GET /api/mapSessions/MapSession/<username>/<slug>/waypoints/
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = WaypointSerializer(session.waypoints.all(), many=True)
    return Response(serializer.data, status=200)

  # POST ... with { x, y, type }
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.waypoints.count() >= 50:  # Just in case frontend fails
      return Response({'detail': 'Max waypoints of 50 reached'}, status=400)
    serializer = WaypointSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.waypoints.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    return Response(serializer.data, status=201)
  
  # DELETE .../waypoints/ — removes every waypoint for this session
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.waypoints.all().delete()
    return Response(status=204)


class WaypointDetailView(APIView):
  permission_classes = [permissions.AllowAny]

  # PATCH .../waypoints/<local_id>/ with any subset of { x, y, type }
  def patch(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    waypoint = get_object_or_404(Waypoint, session=session, local_id=local_id)
    serializer = WaypointSerializer(waypoint, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=200)

  # def delete(self, request, username, slug, local_id):
  #   session = get_session_for_edit(request, username, slug)
  #   waypoint = get_object_or_404(Waypoint, session=session, local_id=local_id)
  #   waypoint.delete()
  #   return Response(status=204)
  
  # DELETE
  def delete(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    waypoint = get_object_or_404(Waypoint, session=session, local_id=local_id)
    with transaction.atomic(): # Wrapping in transaction.atomic() ensures a failure partway through doesn't leave gaps or duplicate IDs.
      waypoint.delete()
      # ascending order avoids colliding with the unique_together('session','local_id') constraint mid-shift
      for wp in session.waypoints.filter(local_id__gt=local_id).order_by('local_id'):
        wp.local_id -= 1
        wp.save(update_fields=['local_id'])
    return Response(status=204)
  
  
  
  
class TargetListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = TargetSerializer(session.targets.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.targets.count() >= 80: # Just in case frontend fails
      return Response({'detail': 'Max targets of 80 reached'}, status=400)
    serializer = TargetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.targets.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.targets.all().delete()
    return Response(status=204)
  
class TargetDetailView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def patch(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    target = get_object_or_404(Target, session=session, local_id=local_id)
    serializer = TargetSerializer(target, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=200)
  
  def delete(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    target = get_object_or_404(Target, session=session, local_id=local_id)
    with transaction.atomic(): # Wrapping in transaction.atomic() ensures a failure partway through doesn't leave gaps or duplicate IDs.
      target.delete()
      # ascending order avoids colliding with the unique_together('session','local_id') constraint mid-shift
      for tg in session.targets.filter(local_id__gt=local_id).order_by('local_id'):
        tg.local_id -= 1
        tg.save(update_fields=['local_id'])
    return Response(status=204)
  
  
  
class TextListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = TextSerializer(session.texts.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.texts.count() >= 80: # Just in case frontend fails
      return Response({'detail': 'Max texts of 80 reached'}, status=400)
    serializer = TextSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.texts.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.texts.all().delete()
    return Response(status=204)
  
class TextDetailView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def patch(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    text = get_object_or_404(Text, session=session, local_id=local_id)
    serializer = TextSerializer(text, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=200)
  
  def delete(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    text = get_object_or_404(Text, session=session, local_id=local_id)
    with transaction.atomic(): # Wrapping in transaction.atomic() ensures a failure partway through doesn't leave gaps or duplicate IDs.
      text.delete()
      # ascending order avoids colliding with the unique_together('session','local_id') constraint mid-shift
      for tg in session.texts.filter(local_id__gt=local_id).order_by('local_id'):
        tg.local_id -= 1
        tg.save(update_fields=['local_id'])
    return Response(status=204)


class FrontlineListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = FrontlineSerializer(session.frontlines.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.frontlines.count() >= 80: # Just in case frontend fails
      return Response({'detail': 'Max frontlines of 80 reached'}, status=400)
    serializer = FrontlineSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.frontlines.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.frontlines.all().delete()
    return Response(status=204)