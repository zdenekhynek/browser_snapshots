import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.fakebox import get_fakebox
from utils.command_utils import get_snapshots, add_arguments

class Command(BaseCommand):
    help = 'Get fakebox using docker image'

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
                'Classifying fake news for limit %s and offset %s and override %s'
                % (limit, offset, override)
            )
        )
        snapshots = get_snapshots(pk, race_id, limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

            if created or override or s.fakebox_raw != '':
                results = get_fakebox(title)
                s.fakebox_raw = results['fakebox_raw']
                s.fakebox_title_decision = results['fakebox_title_decision']
                s.fakebox_title_score = results['fakebox_title_score']
                s.save()

                self.stdout.write(
                    self.style.SUCCESS(
                        'Saving snapshot fakeness: %s - %s:' %
                        (title, s.fakebox_title_decision)
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        'Skipping snaphost as it is already processed: %s' %
                        (title)
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                'Done fakebox analysis'
            )
        )
