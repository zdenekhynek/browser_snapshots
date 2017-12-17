from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

# from dateutil import parser

from .models import Snapshot, Session


class SnapshotSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""
    image = Base64ImageField()

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Snapshot
        fields = ('id', 'agent', 'session', 'url', 'source_code',
                  'image', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')


class SessionSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Session
        fields = ('id', 'agent', 'start', 'end', 'lat', 'lng')
