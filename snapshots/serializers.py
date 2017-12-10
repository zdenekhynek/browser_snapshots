from rest_framework import serializers
from .models import Snapshot


class SnapshotSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Snapshot
        fields = ('id', 'url', 'source_code', 'image_url', 'created_at',
                  'updated_at')
        read_only_fields = ('created_at', 'updated_at')
