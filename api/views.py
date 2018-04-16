from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from snapshots.serializers import SnapshotSerializer, SessionSerializer
from snapshots.models import Snapshot, Session
from tasks.models import Task
from agents.models import Agent
from races.models import Race, RaceTask
from agents.serializers import AgentSerializer
from tasks.serializers import TaskSerializer
from races.serializers import RaceSerializer


class CreateSnapshotView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        serializer.save(owner=self.request.user)


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


class CreateAgentsView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        """Save the post data when creating a new agent."""
        serializer.save(owner=self.request.user)


class CreateTasksView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    serializer_class = TaskSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = Task.objects.all()

        # filter by status
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)

        # filter by agent
        agent = self.request.query_params.get('agent', None)
        if agent is not None:
            queryset = queryset.filter(agent=agent)

        return queryset

    def perform_create(self, serializer):
        """Save the post data when creating a new task."""
        serializer.save()


class DetailsTasksView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class CreateRacesView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Race.objects.all()
    serializer_class = RaceSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new race."""
        data = self.request.data
        keyword = data.get('keyword')
        agents = self.request.POST.getlist('agent')

        serializer.save(keyword=keyword, agents=agents)

class DetailsRacesView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Race.objects.all()
    serializer_class = RaceSerializer


class RaceView(APIView):
    """Get race with all that is necessary"""

    def get(self, request, pk, format=None):
        """
        Return a list of all users.
        """
        race = Race.objects.get(pk=pk)

        # get all tasks
        race_tasks = RaceTask.objects.filter(race=race)

        snapshots_data = []
        for race_task in race_tasks:
            task = Task.objects.get(pk=race_task.task_id)
            try:
                # get all snapshot titles
                snapshots = Snapshot.objects.filter(session=task.session)
                for snapshot in snapshots:
                    snapshot_object = {'title': snapshot.title, 'agent_id':
                        snapshot.agent_id }
                    snapshots_data.append(snapshot_object)
            except:
                print('No snapshots yet')

        return Response({'id': race.id, 'tasks': snapshots_data})
