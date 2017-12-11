from django.db import models


class Agent(models.Model):
    """This class represents the agent model."""
    name = models.CharField(max_length=255, blank=False, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
