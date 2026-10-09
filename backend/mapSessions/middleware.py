from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

@database_sync_to_async
def resolve_user(token):
  try:
    validated = AccessToken(token)
    return User.objects.get(pk=validated['user_id'])
  except Exception:
    return AnonymousUser()

class JWTAuthMiddleware:
  def __init__(self, app):
    self.app = app

  async def __call__(self, scope, receive, send):
    token = parse_qs(scope['query_string'].decode()).get('token', [None])[0]
    scope['user'] = await resolve_user(token) if token else AnonymousUser()
    return await self.app(scope, receive, send)