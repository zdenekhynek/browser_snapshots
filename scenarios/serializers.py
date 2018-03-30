from rest_framework import serializers

from .models import Scenario, ScenarioConfig

class ScenarioConfigSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = ScenarioConfig
        fields = ('key', 'value')


class ScenarioSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    config = ScenarioConfigSerializer(many=True)

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Scenario
        fields = ('id', 'type', 'config')
