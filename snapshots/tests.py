from django.test import TestCase

from .models import Snapshot


class ModelTestCase(TestCase):
    """This class defines the test suite for the snapshot model."""

    def setUp(self):
        """Define the test client and other test variables."""
        self.url = "Snaphost url"
        self.snapshot = Snapshot(url=self.url)

    def test_model_can_create_a_snapshot(self):
        """Test the snapshot model can create a snapshot."""
        old_count = Snapshot.objects.count()
        self.snapshot.save()
        new_count = Snapshot.objects.count()
        self.assertNotEqual(old_count, new_count)
