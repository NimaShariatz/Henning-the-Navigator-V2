from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
  fieldsets = UserAdmin.fieldsets + ( # add all the standard user stuff + the Role from the model
    ('Role', {'fields': ('user_type',)}),
  )
  
  list_display = UserAdmin.list_display + ('user_type',) # add to Home > Accounts

admin.site.register(User, CustomUserAdmin)