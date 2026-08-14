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

  class Meta: # config options for a model
    unique_together = ['user', 'slug'] # **combination** of user and slug MUST BE UNIQUE!
    # ordering = Default sort order for queries
    # db_table = Custom database table name
    # verbose_name = Human-readable name in the admin

  def save(self, *args, **kwargs): # override save so to auto-generate the slug 
    self.slug = slugify(self.title)  # auto-generate slug from title on save
    super().save(*args, **kwargs)