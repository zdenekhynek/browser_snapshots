from django.db import models


class Agent(models.Model):
    """This class represents the agent model."""
    owner = models.ForeignKey('auth.User',
                              related_name='agents',
                              on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
