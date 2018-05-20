from django.db import models

from snapshots.models import Snapshot

class Sentiment(models.Model):
    """This class represents the sentiment model."""
    snapshot = models.ForeignKey(Snapshot, on_delete=models.CASCADE, related_name='analysis')
    title = models.CharField(max_length=1000, blank=False)
    description = models.TextField(max_length=10009, blank=True, null=True)
    sentiment = models.CharField(max_length=255, blank=True, null=True)
    watson_raw_tone = models.CharField(max_length=10000, blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s - %s" % (self.title, self.sentiment)
