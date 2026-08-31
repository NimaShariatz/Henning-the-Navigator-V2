from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import MapSession

User = get_user_model()


class MapSessionModelTests(APITestCase):
  def setUp(self):
    self.owner = User.objects.create_user(username='owner', password='pass123')

  def test_slug_is_generated_from_title_on_save(self):
    session = MapSession.objects.create(
      user=self.owner, title='My Session', map_selected=1,
    )
    self.assertEqual(session.slug, 'my-session')

  def test_same_user_cannot_reuse_slug(self):
    MapSession.objects.create(user=self.owner, title='Dup', map_selected=1)
    with self.assertRaises(Exception):  # IntegrityError on unique_together
      MapSession.objects.create(user=self.owner, title='Dup', map_selected=2)


class MapSessionListViewTests(APITestCase):
  def setUp(self):
    self.owner = User.objects.create_user(username='owner', password='pass123')
    self.other = User.objects.create_user(username='other', password='pass123')
    MapSession.objects.create(user=self.owner, title='Session A', map_selected=1)

  def test_list_requires_authentication(self):
    url = f'/api/mapSessions/list/{self.owner.username}/'
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

  def test_list_returns_basic_fields_only(self):
    self.client.force_authenticate(self.owner)
    response = self.client.get(f'/api/mapSessions/list/{self.owner.username}/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(
        set(response.data[0].keys()),
        {'slug', 'title', 'map_selected', 'all_can_edit', 'last_updated'},
    )
    self.assertEqual(response.data[0]['map_selected'], 'Arras')  # int -> display name

  def test_create_session_as_owner(self):
    self.client.force_authenticate(self.owner)
    payload = {'title': 'New Session', 'map_selected': 'Kuban', 'all_can_edit': True, 'sessionInfo': ''}
    response = self.client.post(f'/api/mapSessions/list/{self.owner.username}/', payload)
    self.assertEqual(response.status_code, 201)

  def test_create_session_as_non_owner_forbidden(self):
    self.client.force_authenticate(self.other)
    payload = {'title': 'New Session', 'map_selected': 'Kuban', 'all_can_edit': True, 'sessionInfo': ''}
    response = self.client.post(f'/api/mapSessions/list/{self.owner.username}/', payload)
    self.assertEqual(response.status_code, 403)

  def test_create_with_invalid_map_name_fails(self):
    self.client.force_authenticate(self.owner)
    payload = {'title': 'Bad Map', 'map_selected': 'Nonexistent', 'all_can_edit': True}
    response = self.client.post(f'/api/mapSessions/list/{self.owner.username}/', payload)
    self.assertEqual(response.status_code, 400)

  def test_create_with_duplicate_title_fails(self):
    self.client.force_authenticate(self.owner)
    payload = {'title': 'Session A', 'map_selected': 'Kuban', 'all_can_edit': True}
    response = self.client.post(f'/api/mapSessions/list/{self.owner.username}/', payload)
    self.assertEqual(response.status_code, 400)


class MapSessionDetailViewTests(APITestCase):
  def setUp(self):
    self.owner = User.objects.create_user(username='owner', password='pass123')
    self.other = User.objects.create_user(username='other', password='pass123')
    self.session = MapSession.objects.create(user=self.owner, title='Session A', map_selected=1)
    self.url = f'/api/mapSessions/MapSession/{self.owner.username}/{self.session.slug}/'

  def test_get_returns_full_detail(self):
    self.client.force_authenticate(self.owner)
    response = self.client.get(self.url)
    self.assertEqual(response.status_code, 200)
    self.assertIn('permitted_to_edit', response.data)
    self.assertIn('sessionInfo', response.data)

  def test_patch_as_owner_updates_title(self):
    self.client.force_authenticate(self.owner)
    response = self.client.patch(self.url, {'title': 'Renamed'})
    self.assertEqual(response.status_code, 200)
    self.session.refresh_from_db()
    self.assertEqual(self.session.title, 'Renamed')

  def test_patch_as_non_owner_forbidden(self):
    self.client.force_authenticate(self.other)
    response = self.client.patch(self.url, {'title': 'Hacked'})
    self.assertEqual(response.status_code, 403)

  def test_delete_as_owner_succeeds(self):
    self.client.force_authenticate(self.owner)
    response = self.client.delete(self.url)
    self.assertEqual(response.status_code, 204)
    self.assertFalse(MapSession.objects.filter(pk=self.session.pk).exists())

  def test_delete_as_non_owner_forbidden(self):
    self.client.force_authenticate(self.other)
    response = self.client.delete(self.url)
    self.assertEqual(response.status_code, 403)