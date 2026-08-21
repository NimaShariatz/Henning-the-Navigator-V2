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
