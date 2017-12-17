from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from snapshots.models import Session


class ViewTestCase(TestCase):
    """Test suite for the api views."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()
        self.snaphost_data = {'agent': 0}
        self.response = self.client.post(
            reverse('create_session'),
            self.snaphost_data,
            format="json")

    def test_api_can_create_a_session(self):
        """Test the api has bucket creation capability."""
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)

    def test_api_can_get_a_session(self):
        """Test the api can get a given session."""
        session = Session.objects.get()
        response = self.client.get(
            reverse('details_session',
                    kwargs={'pk': session.id}), format="json")

        print('response!!!')
        print(response.content)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, session)

    def test_api_can_update_bucketlist(self):
        """Test the api can update a given session."""
        snapshot = Session.objects.get()
        change_snapshot = {'lat': 45.234, 'lng': 15.234}
        res = self.client.patch(
            reverse('details_session', kwargs={'pk': snapshot.id}),
            change_snapshot, format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_api_can_delete_bucketlist(self):
        """Test the api can delete a session."""
        snapshot = Session.objects.get()
        response = self.client.delete(
            reverse('details_session', kwargs={'pk': snapshot.id}),
            format='json',
            follow=True)

        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
