from django.db import models

from agents.models import Agent


class Session(models.Model):
    """This class represents the session model."""
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(blank=True, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6,
                              blank=True, null=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6,
                              blank=True, null=True)


class Snapshot(models.Model):
    """This class represents the snaphost model."""
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True,
                                null=True)
    url = models.CharField(max_length=255, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    source_code = models.TextField()
    image = models.ImageField(upload_to='uploads', max_length=254, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.url)
