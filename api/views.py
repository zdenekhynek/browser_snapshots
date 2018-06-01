from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from agents.models import Agent
from agents.serializers import AgentSerializer
from analysis.get_sentiment import get_sentiment
from analysis.fakebox import store_fakebox
from races.serializers import RaceSerializer
from races.models import Race, RaceTask, get_race_data
from snapshots.serializers import SnapshotSerializer, SessionSerializer
from snapshots.models import Snapshot, Session
from tasks.serializers import TaskSerializer
from tasks.models import Task
from youtube.parser import parse_snapshot
from chat.broadcast import broadcast
from api.signals import race_created_signal, snapshot_created_signal, task_finished_signal

class CreateSnapshotView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Snapshot.objects.all()
    serializer_class = SnapshotSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        """Save the post data when creating a new snaphost."""
        snapshot = serializer.save(owner=self.request.user)

        # parse the snaphost video straight away so that
        # the video stats are immediately available (e.g. for race)
        parse_snapshot(snapshot)

        # parse all the sentiment analysis
        # get_sentiment(snapshot)

        # parse fakebox sentiment
        store_fakebox(snapshot)

        # snapshot_created_signal.send(sender=Snapshot)


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

        # filter by type
        type = self.request.query_params.get('type', None)
        if type is not None:
            queryset = queryset.filter(type=type)

        return queryset

    def perform_create(self, serializer):
        """Save the post data when creating a new task."""
        serializer.save()


class DetailsTasksView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def perform_update(self, serializer):

        instance = serializer.save()

        if instance.type.id == 1 and instance.status.id == 4:
            task_finished_signal.send(sender=Task)



class CreateRacesView(generics.ListCreateAPIView):
    """This class defines the create behavior of our rest api."""
    queryset = Race.objects.all()
    serializer_class = RaceSerializer

    def perform_create(self, serializer):
        """Save the post data when creating a new race."""
        data = self.request.data
        keyword = data.get('keyword')

        agents = []
        if len(self.request.POST.getlist('agent')):
            agents = self.request.POST.getlist('agent')
        elif 'agents' in data:
            # try
            agents = data.get('agents')

        race = serializer.save(keyword=keyword, agents=agents)

        # get race tasks
        tasks = []
        for racetask in race.racetask_set.all():
            tasks.append(TaskSerializer(racetask.task).data)

        broadcast({ 'keyword': keyword,
                    'id': race.id,
                    'tasks': tasks,
                    'message': 'race_started'
                  })


class DetailsRacesView(generics.RetrieveUpdateDestroyAPIView):
    """This class handles the http GET, PUT and DELETE requests."""
    queryset = Race.objects.all()
    serializer_class = RaceSerializer


class RaceView(APIView):
    """Get race with all that is necessary"""

    def get(self, request, pk, format=None):
        """
        Return a list of all races.
        """
        data = get_race_data(int(pk))
        return Response(data)
