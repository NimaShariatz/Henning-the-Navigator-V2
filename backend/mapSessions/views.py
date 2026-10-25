from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.db import models, transaction
from django.db.models import F
from .models import MapSession, Waypoint, Target, Text, Frontline
from .serializers import MapSessionListSerializer, MapSessionDetailSerializer, MapSessionWriteSerializer, WaypointSerializer, TargetSerializer, TextSerializer, FrontlineSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError
from .serializers import MAP_NAME_TO_INT
LIMITS = {'waypoints': 50, 'targets': 100, 'texts': 30, 'frontlines': 150}


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
    bump_version(session)
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
  
# (General Helper) Purpose: if the user is allowed 
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
    if session.waypoints.count() >= LIMITS['waypoints']:  # Just in case frontend fails
      return Response({'detail': f"Max waypoints of {LIMITS['waypoints']} reached"}, status=400)
    serializer = WaypointSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.waypoints.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    bump_version(session)
    return Response(serializer.data, status=201)
  
  # DELETE .../waypoints/ — removes every waypoint for this session
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.waypoints.all().delete()
    bump_version(session)
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
    bump_version(session)
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
      bump_version(session)
    return Response(status=204)
  
  
  
  
class TargetListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = TargetSerializer(session.targets.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.targets.count() >= LIMITS['targets']: # Just in case frontend fails
      return Response({'detail': f"Max targets of {LIMITS['targets']} reached"}, status=400)
    serializer = TargetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.targets.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    bump_version(session)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.targets.all().delete()
    bump_version(session)
    return Response(status=204)
  
class TargetDetailView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def patch(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    target = get_object_or_404(Target, session=session, local_id=local_id)
    serializer = TargetSerializer(target, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    bump_version(session)
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
      bump_version(session)
    return Response(status=204)
  
  
  
class TextListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = TextSerializer(session.texts.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.texts.count() >= LIMITS['texts']: # Just in case frontend fails
      return Response({'detail': f"Max texts of {LIMITS['texts']} reached"}, status=400)
    serializer = TextSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.texts.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    bump_version(session)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.texts.all().delete()
    bump_version(session)
    return Response(status=204)
  
class TextDetailView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def patch(self, request, username, slug, local_id):
    session = get_session_for_edit(request, username, slug)
    text = get_object_or_404(Text, session=session, local_id=local_id)
    serializer = TextSerializer(text, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    bump_version(session)
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
      bump_version(session)
    return Response(status=204)


class FrontlineListView(APIView):
  permission_classes = [permissions.AllowAny]
  
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    serializer = FrontlineSerializer(session.frontlines.all(), many=True)
    return Response(serializer.data, status=200)
  
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    if session.frontlines.count() >= LIMITS['frontlines']: # Just in case frontend fails
      return Response({'detail': f"Max frontlines of {LIMITS['frontlines']} reached"}, status=400)
    serializer = FrontlineSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    next_id = (session.frontlines.aggregate(models.Max('local_id'))['local_id__max'] or 0) + 1
    serializer.save(session=session, local_id=next_id)
    bump_version(session)
    return Response(serializer.data, status=201)
  
  def delete(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)
    session.frontlines.all().delete()
    bump_version(session)
    return Response(status=204)
  
  
  
class GetAllInfo(APIView):
  permission_classes = [permissions.AllowAny]

  # Purpose: Returns every point type plus map and session info in one request
  # Input: GET /api/mapSessions/MapSession/<username>/<slug>/allpoints/
  # Output: { waypoints, texts, frontlines, targets, map_selected, sessionInfo }
  def get(self, request, username, slug):
    session = get_object_or_404(MapSession, user__username=username, slug=slug)
    return Response({
      'waypoints': WaypointSerializer(session.waypoints.all(), many=True).data,
      'texts': TextSerializer(session.texts.all(), many=True).data,
      'frontlines': FrontlineSerializer(session.frontlines.all(), many=True).data,
      'targets': TargetSerializer(session.targets.all(), many=True).data,
      'map_selected': session.get_map_selected_display(),
      'sessionInfo': session.sessionInfo,
      'title': session.title,
      'version': session.version,
    }, status=200)
  
  
# for settings.tsx upload
class SessionImportView(APIView):
  permission_classes = [permissions.AllowAny]

  # POST ... with { mapSelected, waypoints, targets, texts, frontlines } — replaces all points in the session
  def post(self, request, username, slug):
    session = get_session_for_edit(request, username, slug)

    map_name = request.data.get('mapSelected')
    if map_name not in MAP_NAME_TO_INT:
      raise ValidationError({'mapSelected': ['Invalid map name.']})
    # mirrors MapSessionDetailView.patch, which is owner-only
    if MAP_NAME_TO_INT[map_name] != session.map_selected and request.user != session.user:
      raise PermissionDenied()

    specs = [
      ('waypoints', WaypointSerializer, Waypoint),
      ('targets', TargetSerializer, Target),
      ('texts', TextSerializer, Text),
      ('frontlines', FrontlineSerializer, Frontline),
    ]
    validated = {}
    for key, serializer_cls, _ in specs:
      items = request.data.get(key)
      if not isinstance(items, list):
        raise ValidationError({key: ['Expected a list.']})
      if len(items) > LIMITS[key]:
        raise ValidationError({key: [f'Max {key} of {LIMITS[key]} reached']})
      serializer = serializer_cls(data=items, many=True)
      serializer.is_valid(raise_exception=True)
      validated[key] = serializer.validated_data

    with transaction.atomic():
      for key, _, model in specs:
        getattr(session, key).all().delete()
        model.objects.bulk_create([
          model(session=session, local_id=i, **item)  # array order defines ids
          for i, item in enumerate(validated[key], start=1)
        ])
      session.map_selected = MAP_NAME_TO_INT[map_name]
      session.save(update_fields=['map_selected', 'last_updated'])
      bump_version(session)
    
    return Response({
      'waypoints': WaypointSerializer(session.waypoints.all(), many=True).data,
      'targets': TargetSerializer(session.targets.all(), many=True).data,
      'texts': TextSerializer(session.texts.all(), many=True).data,
      'frontlines': FrontlineSerializer(session.frontlines.all(), many=True).data,
    }, status=200)
    
    
    
    
    
    
    
    
    
class SessionVersionView(APIView):
  permission_classes = [permissions.AllowAny]

  # GET .../MapSession/<username>/<slug>/version/ -> { "version": n }
  def get(self, request, username, slug):
    version = MapSession.objects.filter(user__username=username, slug=slug).values_list('version', flat=True).first()
    if version is None:
      return Response(status=404)
    return Response({'version': version})


# (General Helper) Purpose: bump up session version by 1
def bump_version(session):
  MapSession.objects.filter(pk=session.pk).update(version=F('version') + 1) # update() with F() is atomic, so concurrent writers can't lose a bump, and it doesn't touch last_updated
