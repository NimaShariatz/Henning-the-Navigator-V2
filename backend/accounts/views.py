from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from .serializers import RegisterSerializer
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
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