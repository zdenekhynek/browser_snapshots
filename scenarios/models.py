from django.db import models

class ScenarioType(models.Model):
    """This class represents the scenario type model."""
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name

class Scenario(models.Model):
    """This class represents the scenario model."""
    type = models.ForeignKey(ScenarioType, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s - %s" % (self.type, ''.join([a.value for a in self.config.all()]))


class ScenarioConfig(models.Model):
    """This class represents the scenario config model."""
    scenario = models.ForeignKey(Scenario, related_name="config",
                                 on_delete=models.CASCADE)
    key = models.CharField(max_length=255, blank=False)
    value = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return "%s: %s" % (self.key, self.value)
