from django.db import models


class Agent(models.Model):
    """This class represents the agent model."""
    owner = models.ForeignKey('auth.User',
                              related_name='agents',
                              on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False, null=True)
    gmail = models.CharField(max_length=255, blank=True, null=True)
    gmail_password = models.CharField(max_length=255, blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return 'Agent: ' + self.name
