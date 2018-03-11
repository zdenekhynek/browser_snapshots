from django.db import models

from snapshots.models import Snapshot

class Sentiment(models.Model):
    """This class represents the sentiment model."""
    snapshot = models.ForeignKey(Snapshot, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000, blank=False)
    sentiment = models.CharField(max_length=255, blank=False)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s - %s" % (self.title, self.sentiment)