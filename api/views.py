from rest_framework import generics
from snapshots.serializers import SnapshotSerializer
from snapshots.models import Snapshot


class CreateView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        serializer.save()


class DetailsView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""

    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer
