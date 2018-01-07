import base64

from django.test import TestCase
from django.contrib.auth.models import User

from snapshots.models import Snapshot


class ModelTestCase(TestCase):
    """This class defines the test suite for the snapshot model."""

    def setUp(self):
        """Define the test client and other test variables."""
        user = User.objects.create(username='nerd')
        self.url = "Snaphost url"
        self.agent_id = 0
        self.source_code = 'source_code'
        self.image = base64.b64encode(b'')   # mock base64 image
        self.snapshot = Snapshot(owner=user, url=self.url,
                                 agent_id=self.agent_id,
                                 source_code=self.source_code,
                                 image=self.image)

    def test_model_can_create_a_snapshot(self):
        """Test the snapshot model can create a snapshot."""
        old_count = Snapshot.objects.count()
        self.snapshot.save()
        new_count = Snapshot.objects.count()
        self.assertNotEqual(old_count, new_count)
