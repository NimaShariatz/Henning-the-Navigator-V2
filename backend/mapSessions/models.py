from django.db import models

# Create your models here.
import uuid
from django.db import models
from django.conf import settings
from django.utils.text import slugify


# makes use of a slug (URL-safe string)
class MapSession(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # generates a unique ID
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sessions') # Links each session to a user. CASCADE means if the user is deleted, all their sessions are deleted too. related_name='sessions' lets you do user.sessions.all()
  title = models.CharField(max_length=50)
  slug = models.SlugField(max_length=50) # A URL-safe version of the title (e.g. "My Session" → "my-session"), used in the URL path
  created_at = models.DateTimeField(auto_now_add=True) # auto_now_add is the same as manually doing created_at = datetime.now() in save(). also makes the field non-editable. But only done once on creation.
  last_updated = models.DateTimeField(auto_now=True) # Automatically sets the field to the current date and time every time you call .save() on the object
  all_can_edit = models.BooleanField(default=True)
  permitted_to_edit = models.ManyToManyField( # sessions can have many users. users can have many sessions
    settings.AUTH_USER_MODEL, # references whatever model is set as AUTH_USER_MODEL in settings.py. so "accounts.User"
    related_name='editable_sessions', # how you access this relationship from the User side
    blank=True
  )

  MAP_OPTIONS = [
    (1, "Arras"),
    (2, "Kuban"),
    (3, "Lapino"),
    (4, "Moscow"),
    (5, "Normandy"),
    (6, "Novosokolniki"),
    (7, "Odessa"),
    (8, "Prokhorovka"),
    (9, "Rheinland"),
    (10, "Stalingrad"),
    (11, "Vluki"),
    (12, "Western Front"),
  ]
  map_selected = models.IntegerField(choices=MAP_OPTIONS)
  sessionInfo = models.CharField(blank=True, max_length=300)

  class Meta: # config options for a model
    unique_together = ['user', 'slug'] # **combination** of user and slug MUST BE UNIQUE!
    # ordering = Default sort order for queries
    # db_table = Custom database table name
    # verbose_name = Human-readable name in the admin

  def save(self, *args, **kwargs): # override save so to auto-generate the slug 
    self.slug = slugify(self.title)  # auto-generate slug from title on save
    super().save(*args, **kwargs)
    
    
    
    
    
class SessionObjectBase(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # a UUID primary key (same pattern as MapSession.id) so each object has a stable identity that websocket clients can reference directly, instead of relying on a renumbered integer.
  created_at = models.DateTimeField(auto_now_add=True) # created_at / updated_at: auto-managed timestamps, useful for conflict resolution (e.g. last-write-wins) once multiple clients can edit the same session concurrently
  updated_at = models.DateTimeField(auto_now=True)

  class Meta:
    abstract = True # to avoid repeating every id created_at updated_at on the stuff below


class Waypoint(SessionObjectBase): # inherits from SessionObjectBase ()
  WAYPOINT_TYPES = [
    ('startPoint', 'Start Point'),
    ('ingressPoint', 'Ingress Point'),
    ('targetPoint', 'Target Point'),
    ('egressPoint', 'Egress Point'),
  ]
  session = models.ForeignKey(MapSession, on_delete=models.CASCADE, related_name='waypoints')
  order = models.PositiveIntegerField()  # display number, independent of pk, re-assignable without changing identity
  x = models.FloatField()
  y = models.FloatField()
  type = models.CharField(max_length=20, choices=WAYPOINT_TYPES)

  class Meta:
    ordering = ['order']
    unique_together = ['session', 'order']


class Target(SessionObjectBase): # inherits from SessionObjectBase ()
  session = models.ForeignKey(MapSession, on_delete=models.CASCADE, related_name='targets')
  x = models.FloatField()
  y = models.FloatField()
  z = models.FloatField()
  name = models.CharField(max_length=50)
  rotation = models.FloatField()
  type = models.CharField(max_length=20)  # one of TARGET_OPTION_KEYS
  color = models.CharField(max_length=7)  # '#rrggbb'
  scale = models.FloatField(default=1)


class Text(SessionObjectBase): # inherits from SessionObjectBase ()
  session = models.ForeignKey(MapSession, on_delete=models.CASCADE, related_name='texts')
  x = models.FloatField()
  y = models.FloatField()
  text = models.CharField(max_length=300)
  color = models.CharField(max_length=7)
  rotation = models.FloatField()
  size = models.FloatField()


class Frontline(SessionObjectBase): # inherits from SessionObjectBase ()
  session = models.ForeignKey(MapSession, on_delete=models.CASCADE, related_name='frontlines')
  start_x = models.FloatField()
  start_y = models.FloatField()
  end_x = models.FloatField()
  end_y = models.FloatField()
  color = models.CharField(max_length=7)