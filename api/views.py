from rest_framework import generics
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from agents.models import Agent
from agents.serializers import AgentSerializer
from analysis.get_sentiment import get_sentiment
from races.serializers import RaceSerializer
from races.models import Race, RaceTask
from snapshots.serializers import SnapshotSerializer, SessionSerializer
from snapshots.models import Snapshot, Session
from tasks.serializers import TaskSerializer
from tasks.models import Task
from youtube.parser import parse_snapshot


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
        get_sentiment(snapshot)

        # get video category




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

        serializer.save(keyword=keyword, agents=agents)

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

        race = Race.objects.get(pk=pk)

        # get all sessions which correspond to a given task
        sessions = RaceTask.objects.filter(race_id=pk).values('task__session_id')

        session_ids = [session['task__session_id'] for session in sessions]

        snapshots_data = []
        try:
            # get all snapshot titles
            # https://stackoverflow.com/questions/5380529/django-model-foreign-key-queryset-selecting-related-fields
            snapshots = Snapshot.objects.filter(session_id__in=session_ids).order_by('created_at').values('id', 'title', 'url', 'created_at', 'agent_id', 'video__views', 'video__likes', 'video__dislikes', 'video__length', 'analysis__sentiment', 'analysis__caps_sentiment', 'analysis__punctuation_sentiment', 'analysis__gcp_sentiment_score', 'analysis__gcp_sentiment_magnitude', 'analysis__face_sentiment', 'analysis__watson_raw_tone')
            for snapshot in snapshots:

                # append only snapshots with a video
                if snapshot['url'].find('youtube.com/watch?') > -1:
                    try:
                        snapshot_object = {
                            'id': snapshot['id'],
                            'title': snapshot['title'],
                            'url': snapshot['url'],
                            'created_at': snapshot['created_at'],
                            'agent_id': snapshot['agent_id'],
                            'views': snapshot['video__views'],
                            'likes': snapshot['video__likes'],
                            'dislikes': snapshot['video__dislikes'],
                            'length': snapshot['video__length'],
                            'sentiment': snapshot['analysis__sentiment'],
                            'caps_sentiment': snapshot['analysis__caps_sentiment'],
                            'punctuation_sentiment': snapshot['analysis__punctuation_sentiment'],
                            'sentiment_score': snapshot['analysis__gcp_sentiment_score'],
                            'sentiment_magnitude': snapshot['analysis__gcp_sentiment_magnitude'],
                            'face_sentiment': snapshot['analysis__face_sentiment'],
                            'watson_raw_tone': snapshot['analysis__watson_raw_tone']
                        }
                        snapshots_data.append(snapshot_object)
                    except:
                        print('No video for the snapshot')
        except:
            print('No snapshots yet')

        return Response({'id': pk, 'keyword': race.keyword, 'created_at': race.created_at, 'tasks': snapshots_data})
