from django.db import models


class Snapshot(models.Model):
    """This class represents the snaphost model."""
    url = models.CharField(max_length=255, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    source_code = models.TextField()
    image = models.ImageField(upload_to='uploads', max_length=254, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.url)

class Session(models.Model):
    """This class represents the session model."""
    created_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
