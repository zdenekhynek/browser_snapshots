from django.db import models

from agents.models import Agent
from snapshots.models import Session


class ScenarioType(models.Model):
    """This class represents the scenario type model."""
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name;


class ScenarioStatus(models.Model):
    """This class represents the scenario status model."""
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name;


class Scenario(models.Model):
    """This class represents the scenario model."""
    type = models.ForeignKey(ScenarioType, on_delete=models.CASCADE)
    status = models.ForeignKey(ScenarioStatus, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True,
      null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s - %s - %s" % (self.agent, self.type, self.created_at)
