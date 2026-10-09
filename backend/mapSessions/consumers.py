from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import MapSession, Waypoint, Target, Text, Frontline
from .serializers import WaypointSerializer, TargetSerializer, TextSerializer, FrontlineSerializer

MODEL_SERIALIZERS = {
    'waypoint': (Waypoint, WaypointSerializer),
    'target': (Target, TargetSerializer),
    'text': (Text, TextSerializer),
    'frontline': (Frontline, FrontlineSerializer),
}


class MapSessionConsumer(AsyncJsonWebsocketConsumer):
  async def connect(self):
    self.username = self.scope['url_route']['kwargs']['username']
    self.slug = self.scope['url_route']['kwargs']['slug']
    self.group_name = f'session_{self.username}_{self.slug}'

    session = await self.get_session()
    if session is None:
        await self.close(code=4404)
        return

    await self.channel_layer.group_add(self.group_name, self.channel_name)
    await self.accept()

  async def disconnect(self, code):
    await self.channel_layer.group_discard(self.group_name, self.channel_name)

  async def receive_json(self, content):
    kind, action = content.get('kind'), content.get('action')
    if kind not in MODEL_SERIALIZERS or action not in ('create', 'update', 'delete'):
        return

    if not await self.user_can_edit():
        await self.send_json({'kind': 'error', 'message': 'not permitted to edit this session'})
        return

    result = await self.apply_change(kind, action, content.get('data', {}))
    if result is not None:
        await self.channel_layer.group_send(self.group_name, {
            'type': 'broadcast', 'kind': kind, 'action': action, 'data': result,
        })

  async def broadcast(self, event):
    await self.send_json({'kind': event['kind'], 'action': event['action'], 'data': event['data']})

  @database_sync_to_async
  def get_session(self):
    return MapSession.objects.filter(user__username=self.username, slug=self.slug).first()

  @database_sync_to_async
  def user_can_edit(self):
    session = MapSession.objects.get(user__username=self.username, slug=self.slug)
    if session.all_can_edit:
        return True  # writes open to everyone, identity irrelevant
    user = self.scope['user']
    return user.is_authenticated and (
        user == session.user or session.permitted_to_edit.filter(pk=user.pk).exists()
    )

  @database_sync_to_async
  def apply_change(self, kind, action, data):
    model, serializer_cls = MODEL_SERIALIZERS[kind]
    session = MapSession.objects.get(user__username=self.username, slug=self.slug)

    if action == 'create':
        serializer = serializer_cls(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(session=session)
        return serializer_cls(instance).data

    if action == 'update':
        instance = model.objects.get(pk=data['id'], session=session)
        serializer = serializer_cls(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return serializer_cls(instance).data

    if action == 'delete':
        model.objects.filter(pk=data['id'], session=session).delete()
        return {'id': data['id']}