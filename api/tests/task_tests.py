from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from tasks.models import Task

class ViewTestCase(TestCase):
    """Test suite for the api views."""

    def setUp(self):
        """Define the test client and other test variables."""
        user = User.objects.create(username='nerd')

        self.client = APIClient()
        self.client.force_authenticate(user=user)

        self.task_data = {'type': 1, 'status': 1, 'agent': 0}
        self.response = self.client.post(
            reverse('create_tasks'),
            self.task_data,
            format="json")
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)

    def test_can_update_task(self):
        """Can patch task"""
        task = Task.objects.get()
        change_task = {'status': 4}
        res = self.client.put(
          reverse('details', kwargs={'pk': task.id}),
          change_task, format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

