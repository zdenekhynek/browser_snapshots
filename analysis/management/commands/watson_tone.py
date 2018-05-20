import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.sentiment import SentimentClassifier
from analysis.watson_tone_analyzer import WatsonToneAnalyzer
from utils.command_utils import get_snapshots, add_arguments


class Command(BaseCommand):
    help = 'Do watson tone analysis on titles'

    def add_arguments(self, parser):
        add_arguments(parser)


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

        watson_tone_analyzer = WatsonToneAnalyzer()

        snapshots = get_snapshots(pk, race_id, limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

            if created or override:
                s.watson_raw_tone = json.dumps(watson_tone_analyzer.tone(title))
                s.title = title
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
