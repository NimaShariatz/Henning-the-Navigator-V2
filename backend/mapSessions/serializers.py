from rest_framework import serializers
from .models import MapSession, Waypoint, Target, Text, Frontline
from django.utils.text import slugify
from django.contrib.auth import get_user_model
User = get_user_model()

# serializers.py handles data concerns: validates the input and creates the object.


class WaypointSerializer(serializers.ModelSerializer):
  class Meta:
    model = Waypoint
    fields = ['id', 'order', 'x', 'y', 'type']


class TargetSerializer(serializers.ModelSerializer):
  class Meta:
    model = Target
    fields = ['id', 'x', 'y', 'z', 'name', 'rotation', 'type', 'color', 'scale']


class TextSerializer(serializers.ModelSerializer):
  class Meta:
    model = Text
    fields = ['id', 'x', 'y', 'text', 'color', 'rotation', 'size']


class FrontlineSerializer(serializers.ModelSerializer):
  class Meta:
    model = Frontline
    fields = ['id', 'start_x', 'start_y', 'end_x', 'end_y', 'color']


class MapSessionListSerializer(serializers.ModelSerializer): #lightweight serializer for list page.
  map_selected = serializers.CharField(source='get_map_selected_display') # exclusively for having map_selected return string, not the option number (int). otherwise, doesnt need to exist
  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit', 'last_updated']


class MapSessionDetailSerializer(serializers.ModelSerializer): # a more detailed list
  map_selected = serializers.CharField(source='get_map_selected_display') # exclusively for having map_selected return string, not the option number (int). otherwise, doesnt need to exist
  permitted_to_edit = serializers.SlugRelatedField(
    many=True, read_only=True, slug_field='username'
  )
  waypoints = WaypointSerializer(many=True, read_only=True)
  targets = TargetSerializer(many=True, read_only=True)
  texts = TextSerializer(many=True, read_only=True)
  frontlines = FrontlineSerializer(many=True, read_only=True)

  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit',
    'permitted_to_edit', 'sessionInfo', 'created_at', 'last_updated',
    'waypoints', 'targets', 'texts', 'frontlines']


MAP_NAME_TO_INT = {label: value for value, label in MapSession.MAP_OPTIONS}

class MapSessionWriteSerializer(serializers.ModelSerializer):
  map_selected = serializers.CharField() # accept string from frontend
  permitted_to_edit = serializers.SlugRelatedField(
    many=True, slug_field='username', queryset=User.objects.all(), required=False
  )
  class Meta:
    model = MapSession
    fields = ['title', 'map_selected', 'all_can_edit', 'sessionInfo', 'permitted_to_edit']

  def validate_map_selected(self, value):
    if value not in MAP_NAME_TO_INT:
      raise serializers.ValidationError("Invalid map name.")
    return MAP_NAME_TO_INT[value]  # convert "Arras" → 1

  def validate_title(self, value): # validate the title before the DB is touched, otherwise you get a wonky error message
    user = self.context.get('user')
    slug = slugify(value)
    qs = MapSession.objects.filter(user=user, slug=slug)
    if self.instance:  # exclude current session in edit mode
        qs = qs.exclude(pk=self.instance.pk)
    if qs.exists():
        raise serializers.ValidationError("A session with this name already exists.")
    return value