from django.urls import path
from .views import RegisterView, UserView, UserSearchView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('user/', UserView.as_view()),  # GET /api/accounts/user/
    path('search/', UserSearchView.as_view()), # GET /api/accounts/search/ 
]