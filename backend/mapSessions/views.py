from rest_framework.views import APIView
from rest_framework import generics, permissions

# Create your views here.


class MapSessionView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  
  def get():
    print("asd")
