from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from .models import Snapshot


class SnapshotSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    image = Base64ImageField()

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Snapshot
        fields = ('id', 'url', 'source_code', 'image', 'created_at',
                  'updated_at')
        read_only_fields = ('created_at', 'updated_at')
