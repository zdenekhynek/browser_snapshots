import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.google_sentiment import classify_text
from races.models import RaceTask

class Command(BaseCommand):
    help = 'Do google cloud platform natural language sentiment analysis'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int)
        parser.add_argument('--offset', type=int)
        parser.add_argument('--override', type=bool)
        parser.add_argument('--pk', type=int)
        parser.add_argument('--race_id', type=int)

    def get_snapshots_for_race(self, race_id):
        sessions = RaceTask.objects.filter(race_id=race_id).values('task__session_id')
        session_ids = [session['task__session_id'] for session in sessions]
        return Snapshot.objects.filter(session_id__in=session_ids)

    def get_snapshots(self, pk=False, race_id=False, limit=False, offset=False):
        if pk:
            snapshots = Snapshot.objects.filter(pk=pk)
        elif race_id:
            snapshots = self.get_snapshots_for_race(race_id)
        else:
            if limit and offset:
                snapshots = Snapshot.objects.all()[offset:offset+limit]
            elif limit:
                snapshots = Snapshot.objects.all()[:limit]
            elif offset:
                snapshots = Snapshot.objects.all()[offset:]
            else:
                snapshots = Snapshot.objects.all()

        return snapshots


    def handle(self, *args, **options):
        pk = options['pk']
        race_id = options['race_id']
        limit = options['limit']
        offset = options['offset']
        override = options['override']

        self.stdout.write(
            self.style.SUCCESS(
                'Classifying tone for limit %s and offset %s and override %s'
                % (limit, offset, override)
            )
        )
        snapshots = self.get_snapshots(pk, race_id, limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

            if created or override:
                google_sentiment = classify_text(title)
                s.gcp_sentiment_score = google_sentiment[0]
                s.gcp_sentiment_magnitude = google_sentiment[1]
                s.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        'Saving snapshot sentiment: %s - %s: %s' %
                        (title, s.sentiment, s.watson_raw_tone)
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        'Skipping snaphost as it is already processed: %s' %
                        (s.title)
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                'Done sentiment analysis'
            )
        )
