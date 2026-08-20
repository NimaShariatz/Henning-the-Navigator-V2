from rest_framework import serializers
from .models import MapSession

class MapSessionListSerializer(serializers.ModelSerializer):
  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit', 'last_updated']

class MapSessionDetailSerializer(serializers.ModelSerializer):
  permitted_to_edit = serializers.SlugRelatedField(
    many=True, read_only=True, slug_field='username'
  )
  class Meta:
    model = MapSession
    fields = ['slug', 'title', 'map_selected', 'all_can_edit',
      'permitted_to_edit', 'sessionInfo', 'created_at', 'last_updated']