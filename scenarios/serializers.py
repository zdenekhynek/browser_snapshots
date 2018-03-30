from rest_framework import serializers

from .models import Scenario, ScenarioConfig


class ConfigSerializer(serializers.Field):
    def to_representation(self, obj):
        ret = {
            obj.key: obj.value
        }
        return ret


class ScenarioConfigSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    settings = ConfigSerializer(source='*')

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = ScenarioConfig
        fields = ('settings',)


class ScenarioSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    config = ScenarioConfigSerializer(many=True)

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Scenario
        fields = ('id', 'type', 'config')
