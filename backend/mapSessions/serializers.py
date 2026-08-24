from rest_framework import serializers
from .models import MapSession

# serializers.py handles data concerns: validates the input and creates the object.


class MapSessionListSerializer(serializers.ModelSerializer): #lightweight serializer for list page.
  map_selected = serializers.CharField(source='get_map_selected_display') # exclusively for having map_selected return string, not the option number (int). otherwise, doesnt need to exist
  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit', 'last_updated']

class MapSessionDetailSerializer(serializers.ModelSerializer): # a more detailed list
  map_selected = serializers.CharField(source='get_map_selected_display') # exclusively for having map_selected return string, not the option number (int). otherwise, doesnt need to exist
  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit',
    'permitted_to_edit', 'sessionInfo', 'created_at', 'last_updated']

    
  permitted_to_edit = serializers.SlugRelatedField(
    many=True, read_only=True, slug_field='username'
  )


MAP_NAME_TO_INT = {label: value for value, label in MapSession.MAP_OPTIONS}

class MapSessionWriteSerializer(serializers.ModelSerializer):
  map_selected = serializers.CharField()  # accept string from frontend

  class Meta:
    model = MapSession
    fields = ['title', 'map_selected', 'all_can_edit', 'sessionInfo']

  def validate_map_selected(self, value):
    if value not in MAP_NAME_TO_INT:
      raise serializers.ValidationError("Invalid map name.")
    return MAP_NAME_TO_INT[value]  # convert "Arras" → 1