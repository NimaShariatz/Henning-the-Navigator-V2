from django.contrib import admin
from django.db.models import F
from .models import MapSession, Waypoint, Target, Text, Frontline


class MapSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'map_selected', 'all_can_edit', 'created_at', 'last_updated')
    readonly_fields = ('id', 'slug', 'created_at', 'last_updated')

admin.site.register(MapSession, MapSessionAdmin)


# Admin edits bypass the API views, so bump the session version here.
# Otherwise polling clients (the /version/ endpoint) won't notice the change.
class SessionObjectAdmin(admin.ModelAdmin):
    readonly_fields = ('last_updated',)
    list_filter = ('session',)
    search_fields = ('session__title', 'session__user__username')

    def _bump(self, session):
        MapSession.objects.filter(pk=session.pk).update(version=F('version') + 1)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        self._bump(obj.session)

    def delete_model(self, request, obj):
        session = obj.session
        super().delete_model(request, obj)
        self._bump(session)

    def delete_queryset(self, request, queryset):
        sessions = list(MapSession.objects.filter(pk__in=queryset.values_list('session', flat=True)))
        super().delete_queryset(request, queryset)
        for s in sessions:
            self._bump(s)


@admin.register(Waypoint)
class WaypointAdmin(SessionObjectAdmin):
    list_display = ('session', 'local_id', 'type', 'x', 'y', 'last_updated')

@admin.register(Target)
class TargetAdmin(SessionObjectAdmin):
    list_display = ('session', 'local_id', 'name', 'type', 'color', 'x', 'y', 'z', 'last_updated')

@admin.register(Text)
class TextAdmin(SessionObjectAdmin):
    list_display = ('session', 'local_id', 'text', 'color', 'size', 'last_updated')

@admin.register(Frontline)
class FrontlineAdmin(SessionObjectAdmin):
    list_display = ('session', 'local_id', 'color', 'x_start', 'y_start', 'x_end', 'y_end', 'last_updated')