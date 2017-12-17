from rest_framework import generics
from snapshots.serializers import SnapshotSerializer, SessionSerializer
from snapshots.models import Snapshot, Session


class CreateSnapshotView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        serializer.save()


class DetailsSnapshotView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer


class CreateSessionView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        serializer.save()


class DetailsSessionView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
