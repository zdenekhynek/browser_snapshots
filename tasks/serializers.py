from rest_framework import serializers

from .models import Task
from scenarios.serializers import ScenarioSerializer


class TaskSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    # owner = serializers.ReadOnlyField(source='owner.username')
    scenario = ScenarioSerializer()

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Task
        fields = ('id', 'status', 'type', 'agent', 'session', 'scenario')
