from django.db import models
from django.dispatch import receiver

from agents.models import Agent
from tasks.models import Task
from snapshots.models import Snapshot
from chat.broadcast import broadcast
from api.signals import snapshot_created_signal, task_finished_signal

class RaceStatus(models.Model):
    """This class represents the scenario status model."""
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name;

class Race(models.Model):
    """This class represents the scenario model."""
    status = models.ForeignKey(RaceStatus, on_delete=models.CASCADE, default=1)
    keyword = models.CharField(max_length=255, blank=True, null=True)
    is_highlighted = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s - %s" % (self.id, self.description,)


class RaceAgent(models.Model):
    """This class represents the scenario model."""
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, related_name='agents', on_delete=models.CASCADE)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.race)


class RaceTask(models.Model):
    """This class represents the scenario model."""
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, related_name='tasks', on_delete=models.CASCADE)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.race)


class KeywordType(models.Model):
    """This class represents the scenario status model."""
    name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.name;


class Keyword(models.Model):
    """This class represents the keyword model."""
    keyword = models.CharField(max_length=255, blank=True, null=True)
    has_been_selected = models.BooleanField(default=False)
    type = models.ForeignKey(KeywordType, on_delete=models.CASCADE)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.keyword)


def get_race_data(race_id):
    race = Race.objects.get(pk=race_id)

    # get all sessions which correspond to a given task
    sessions = RaceTask.objects.filter(race_id=race_id).values('task__session_id')

    session_ids = [session['task__session_id'] for session in sessions]

    snapshots_data = []

    try:
        # get all snapshot titles
        # https://stackoverflow.com/questions/5380529/django-model-foreign-key-queryset-selecting-related-fields
        snapshots = Snapshot.objects.filter(session_id__in=session_ids).order_by('created_at').values('id', 'video__title', 'url', 'created_at', 'agent_id', 'video__id', 'video__views', 'video__likes', 'video__dislikes', 'video__length', 'video__favorites', 'video__comment_count', 'analysis__sentiment', 'analysis__gcp_sentiment_score', 'analysis__gcp_sentiment_magnitude', 'video__category_id', 'video__category__title', 'analysis__fakebox_title_decision', 'analysis__fakebox_title_score')
        for snapshot in snapshots:

            # append only snapshots with a video
            if snapshot['url'].find('youtube.com/watch?') > -1:
                try:
                    snapshot_object = {
                        'id': snapshot['id'],
                        'video_id': snapshot['video__id'],
                        'title': snapshot['video__title'],
                        'url': snapshot['url'],

                        # datetime is not seriazable so cast it to string
                        'created_at': str(snapshot['created_at'].now()),

                        'agent_id': snapshot['agent_id'],
                        'views': snapshot['video__views'],
                        'likes': snapshot['video__likes'],
                        'dislikes': snapshot['video__dislikes'],
                        'favorites': snapshot['video__favorites'],
                        'comment_count': snapshot['video__comment_count'],
                        'length': snapshot['video__length'],
                        'sentiment': snapshot['analysis__sentiment'],
                        'sentiment_score': snapshot['analysis__gcp_sentiment_score'],
                        'sentiment_magnitude': snapshot['analysis__gcp_sentiment_magnitude'],
                        'category': snapshot['video__category_id'],
                        'category_name': snapshot['video__category__title'],
                        'fakebox_title_decision': snapshot['analysis__fakebox_title_decision'],
                        'fakebox_title_score': snapshot['analysis__fakebox_title_score'],
                    }
                    snapshots_data.append(snapshot_object)
                except:
                    print('No video for the snapshot')
    except:
        print('No snapshots yet')

    # datetime is not seriazable so cast it to string
    race_created_at = str(race.created_at.now())

    return {'id': race_id, 'keyword': race.keyword, 'created_at': race_created_at, 'tasks': snapshots_data}

@receiver(snapshot_created_signal)
def update_race(sender, **kwargs):
    # TODO - check that the snapshot belongs to the active race
    # TODO - how to pick an active race
    last_race = Race.objects.latest('created_at')
    data = get_race_data(last_race.id)

    data['message'] = 'race_update'
    broadcast(data)


@receiver(task_finished_signal)
def task_finished(sender, **kwargs):
    # TODO - check that the snapshot belongs to the active race
    # TODO - how to pick an active race
    last_race = Race.objects.latest('created_at')

    # go through all race tasks, and if all finished, broadcast race stopped
    race_tasks = last_race.racetask_set.all()
    race_finished = all([race_task.task.status.id == 4 for race_task in race_tasks])

    if race_finished:
        data = get_race_data(last_race.id)
        data['message'] = 'race_finished'
        broadcast(data)
    else:
        # race has still some unfinished tasks, do nothing
        print('race has still some unfinished tasks')
        pass
