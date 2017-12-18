from rest_framework import generics
from rest_framework import permissions

from snapshots.serializers import SnapshotSerializer, SessionSerializer
from snapshots.models import Snapshot, Session
from snapshots.parser import get_youtube_title


class CreateSnapshotView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        title = get_youtube_title(self.request.source_code)
        serializer.save(owner=self.request.user, title=title)


class DetailsSnapshotView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer


class CreateSessionView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        serializer.save(owner=self.request.user)


class DetailsSessionView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
