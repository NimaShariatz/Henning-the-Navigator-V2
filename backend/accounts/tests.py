from rest_framework.test import APIClient
from rest_framework import status
from django.test import TestCase
from .models import User






# tests registration
class RegisterViewTests(TestCase):
  def setUp(self):
    self.client = APIClient()
  
  #send a POST to '/api/accounts/register/' which should return a 201 OK with a access and refresh token
  def test_valid_registration_returns_201(self):
    res = self.client.post('/api/accounts/register/', {
      'username': 'testuser',
      'password': 'securepassword99'
    })
    self.assertEqual(res.status_code, status.HTTP_201_CREATED)
    self.assertIn('access', res.data)
    self.assertIn('refresh', res.data)
    
    
  # Create a user with a name and password. Then make a POST with the same name and username. should return a 400. So does a short or numeric password. or missing username
  def test_duplicate_username_returns_400(self):
    User.objects.create_user(username='testuser', password='securepassword99')
    res = self.client.post('/api/accounts/register/', {
      'username': 'testuser',
      'password': 'securepass99'
    })
    self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
    

# test login attemps and requests for tokens
class LoginTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    User.objects.create_user(username='testuser', password='securepassword99')

  # test that the user is given tokens
  def test_valid_credentials_return_tokens(self):
    res = self.client.post('/api/token/', {
      'username': 'testuser',
      'password': 'securepassword99'
    })
    self.assertEqual(res.status_code, status.HTTP_200_OK)
    self.assertIn('access', res.data)
    self.assertIn('refresh', res.data)

  # test the request for tokens if the password given is wrong
  def test_wrong_password_returns_401(self):
    res = self.client.post('/api/token/', {
      'username': 'testuser',
      'password': 'wrongpassword'
    })
    self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

  # test the request for tokens if the username is wrong
  def test_nonexistent_user_returns_401(self):
    res = self.client.post('/api/token/', {
      'username': 'ghost',
      'password': 'securepassword99'
    })
    self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
    





 # test user name fetching
class UserViewTests(TestCase):
  def setUp(self):
    self.client = APIClient()
    self.user = User.objects.create_user(username='testuser', password='securepassword99')
  
  # get the user name with '/api/accounts/user/'
  def test_authenticated_request_returns_200_with_username(self):
    self.client.force_authenticate(user=self.user) # force authentication. we are not testing JWT tokens right now
    res = self.client.get('/api/accounts/user/')
    self.assertEqual(res.status_code, status.HTTP_200_OK)
    self.assertEqual(res.data['username'], 'testuser')

  # get the username when in reality the user is not logged in
  def test_unauthenticated_request_returns_401(self):
    res = self.client.get('/api/accounts/user/')
    self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)