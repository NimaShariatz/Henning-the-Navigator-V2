from django.contrib import admin
from .models import MapSession


class MapSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'map_selected', 'all_can_edit', 'created_at', 'last_updated')
    readonly_fields = ('id', 'slug', 'created_at', 'last_updated')  # auto-generated on save, so not something to edit or create

admin.site.register(MapSession, MapSessionAdmin)