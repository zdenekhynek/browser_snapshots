from django.db import models

from agents.models import Agent


class Training(models.Model):
    """This class represents the scenario model."""
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    interval = models.IntegerField(default=3600)

    def __str__(self):
        return self.agent.name;


class TrainingKeyword(models.Model):
    """This class represents the training status model."""
    training = models.ForeignKey(Training, related_name="keywords",
                                 on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name;
