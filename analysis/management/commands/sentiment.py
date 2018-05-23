import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.get_sentiment import get_sentiment
from races.models import RaceTask
from utils.command_utils import get_snapshots, add_arguments

class Command(BaseCommand):
    help = 'Do sentiment analysis'

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
        snapshots = get_snapshots(pk, race_id, limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            s = get_sentiment(snapshot)

            self.stdout.write(
                self.style.SUCCESS(
                    'Saving snapshot sentiment: %s - %s' %
                    (snapshot.title, s.gcp_sentiment_score)
                )
            )

        self.stdout.write(
            self.style.SUCCESS(
                'Done sentiment analysis'
            )
        )
