from django.db import models
from django.contrib.auth.models import AbstractUser # extends Django's built-in AbstractUser. Access to username, password, email, etc.) and methods (is_authenticated, set_password, etc


# AbstractUser gives these fields for free: username, password, first_name, last_name, is_staff, is_active, date_joined
class User(AbstractUser):
  USER_TYPES = [
    ("A", "Admin"),
    ("U", "User")
  ]
  
  user_type = models.CharField(max_length=1, choices=USER_TYPES, default="U")
  #password and username are implimented by default. AbstractUser already enforces unique=True on username
