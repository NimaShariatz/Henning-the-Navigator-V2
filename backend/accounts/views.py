from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth
from mapSessions.models import MapSession, Waypoint, Target
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
User = get_user_model()
#views.py handles HTTP concerns: receives the request, returns a response, and generates tokens.

  
# Purpose: Handles POST /api/accounts/register/ - validates signup data and returns JWT tokens for an authenticated session
# Input: JSON from frontend. { "username": "john", "password": "secret123" }
# Output: JSON response with a pair of tokens on a 201. { "refresh": "...", "access": "..." }
class RegisterView(generics.CreateAPIView):
  serializer_class = RegisterSerializer # use accounts/serializers.py
  permission_classes = [permissions.AllowAny] # disables auth as user does not have a token yet
  
  # called automatically by CreateAPIView when it receives a POST request
  def create(self, request, *args, **kwargs): # override CreateAPIView so we can return tokens as well
    serializer = self.get_serializer(data=request.data)# passes data into serializer
    serializer.is_valid(raise_exception=True) # will return 400 is validation fails
    user = serializer.save() # call RegisterSerializer.create()
    refresh = RefreshToken.for_user(user)
    return Response({ # return a fresh pair of tokens
      'refresh': str(refresh),
      'access': str(refresh.access_token)
    }, status=201)
    
    

class UserView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  # Purpose: Returns the username of the currently authenticated user. Acts as a backend guard — rejects unauthenticated requests with a 401
  # Input: GET /api/accounts/user/ with the JWT access token in the Authorization header. Authorization: Bearer <access_token>
  # Output: JSON with the username on success (200) { "username": "john" }
  def get(self, request):
    return Response({'username' : request.user.username}, status=200)
  
  # Purpose: deletes the user
  # Input: DELETE /api/accounts/user/ with the JWT access token in the Authorization header. Authorization: Bearer <access_token>
  # Output: a 204 confirmation
  def delete(self, request):
    request.user.delete()
    return Response(status=204)
  
  
  
  
class UserSearchView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  # Purpose: for returning a list of users and such for the mapSessions permitted_to_edit list, and frontend search
  # Input: GET /api/accounts/search/?q=<term>
  # Output: JSON array of usernames matching the term (excludes the requester)
  def get(self, request):
    q = request.query_params.get('q', '').strip()
    if not q:
      return Response([], status=200)
    usernames = (
      User.objects.filter(username__icontains=q)
      .exclude(pk=request.user.pk)
      .values_list('username', flat=True)[:10]
    )
    return Response(list(usernames), status=200)
  
  
  
class AdminView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  # Purpose: check if the user is an admin type
  # Input: GET /admin
  # Output: a 200 if user is an admin type
  def get(self, request):
    user = request.user
    if user.is_staff:
      return Response(status=200)
    else:
      raise PermissionDenied()
  
  
  
class AdminStatsView(APIView):
  permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

  # Purpose: aggregated session stats for the admin panel charts
  # Input: GET /api/accounts/admin/stats/ with the JWT access token (admin only)
  # Output: JSON with totals and chart-ready lists of { label, count }
  def get(self, request):
    map_names = dict(MapSession.MAP_OPTIONS)

    sessions_per_day = (
      MapSession.objects
      .annotate(day=TruncDate('created_at'))
      .values('day')
      .annotate(count=Count('id'))
      .order_by('day')
    )
    sessions_per_map = (
      MapSession.objects
      .values('map_selected')
      .annotate(count=Count('id'))
      .order_by('-count')
    )
    edit_access = (
      MapSession.objects
      .values('all_can_edit')
      .annotate(count=Count('id'))
    )
    target_types = Target.objects.values('type').annotate(count=Count('id')).order_by('-count')
    waypoint_types = Waypoint.objects.values('type').annotate(count=Count('id')).order_by('-count')
    top_users = (
      MapSession.objects
      .values('user__username')
      .annotate(count=Count('id'))
      .order_by('-count')[:10]
    )
    
    new_users_per_month = (
      User.objects
      .annotate(month=TruncMonth('date_joined'))
      .values('month')
      .annotate(count=Count('id'))
      .order_by('month')
    )
    sessions_per_month = (
      MapSession.objects
      .annotate(month=TruncMonth('created_at'))
      .values('month')
      .annotate(count=Count('id'))
      .order_by('month')
    )

    # optional ?year=YYYY&month=M for a single month's signup count
    users_in_month = None
    year = request.query_params.get('year')
    month = request.query_params.get('month')
    if year and month:
      try:
        users_in_month = User.objects.filter(
          date_joined__year=int(year), date_joined__month=int(month)
        ).count()
      except ValueError:
        return Response({'detail': 'year and month must be integers'}, status=400)
    
    
    

    return Response({
      'totals': {
        'users': User.objects.count(),
        'sessions': MapSession.objects.count(),
        'targets': Target.objects.count(),
        'waypoints': Waypoint.objects.count(),
      },
      'sessions_per_day': [
        {'label': row['day'].isoformat(), 'count': row['count']} for row in sessions_per_day
      ],
      'sessions_per_map': [
        {'label': map_names.get(row['map_selected'], 'Unknown'), 'count': row['count']}
        for row in sessions_per_map
      ],
      'edit_access': [
        {'label': 'Anyone can edit' if row['all_can_edit'] else 'Restricted', 'count': row['count']}
        for row in edit_access
      ],
      'target_types': [{'label': row['type'], 'count': row['count']} for row in target_types],
      'waypoint_types': [{'label': row['type'], 'count': row['count']} for row in waypoint_types],
      'top_users': [
        {'label': row['user__username'], 'count': row['count']} for row in top_users
      ],
      
      
      'users_in_month': users_in_month,
      'new_users_per_month': [
        {'label': row['month'].strftime('%Y-%m'), 'count': row['count']} for row in new_users_per_month
      ],
      'sessions_per_month': [
        {'label': row['month'].strftime('%Y-%m'), 'count': row['count']} for row in sessions_per_month
      ],
      
      
      
    }, status=200)