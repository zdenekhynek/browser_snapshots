from django.db import models

from agents.models import Agent
from tasks.models import Task


class Race(models.Model):
    """This class represents the scenario model."""
    keyword = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.id,)


class RaceAgent(models.Model):
    """This class represents the scenario model."""
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.race)


class RaceTask(models.Model):
    """This class represents the scenario model."""
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.race)
