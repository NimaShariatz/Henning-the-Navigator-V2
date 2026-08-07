from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


# Purpose: validates incoming signup data and creates a new User with a hashed password. called in views.py
# Input: frontend request data. { "username": "john", "password": "secret123" }
# Output: A saved User model instance returned to views.py by .save()
class RegisterSerializer(serializers.ModelSerializer): # import User model
  password = serializers.CharField(write_only=True, validators=[validate_password]) # password will never be included. Can only come in, not go out
  
  class Meta: # only username and password are accepted. is_staff, user_type, is all ignored
    model = User
    fields = ('username', 'password')
    
  def create (self, validated_data):
    return User.objects.create_user(**validated_data) # create_user instead of create, so the password is hashed