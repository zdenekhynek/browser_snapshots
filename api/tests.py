import base64

from django.test import TestCase

from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

from snapshots.models import Snapshot


class ViewTestCase(TestCase):
    """Test suite for the api views."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.client = APIClient()
        image = base64.b64encode(b'')   # mock base64 image
        self.snaphost_data = {'agent': 0, 'url': 'Url',
                              'source_code': 'Source code',
                              'image': image}
        self.response = self.client.post(
            reverse('create'),
            self.snaphost_data,
            format="json")

    def test_api_can_create_a_snapshot(self):
        """Test the api has bucket creation capability."""
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)

    def test_api_can_get_a_snapshot(self):
        """Test the api can get a given snapshot."""
        snapshot = Snapshot.objects.get()
        response = self.client.get(
            reverse('details',
                    kwargs={'pk': snapshot.id}), format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, snapshot)

    def test_api_can_update_bucketlist(self):
        """Test the api can update a given snapshot."""
        snapshot = Snapshot.objects.get()
        change_snapshot = {'url': 'Url'}
        res = self.client.patch(
            reverse('details', kwargs={'pk': snapshot.id}),
            change_snapshot, format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_api_can_delete_bucketlist(self):
        """Test the api can delete a snapshot."""
        snapshot = Snapshot.objects.get()
        response = self.client.delete(
            reverse('details', kwargs={'pk': snapshot.id}),
            format='json',
            follow=True)

        self.assertEquals(response.status_code, status.HTTP_204_NO_CONTENT)
