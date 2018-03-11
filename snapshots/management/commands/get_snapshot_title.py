from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from snapshots.parser import get_youtube_title


class Command(BaseCommand):
    help = 'Parse source code to title'

    def add_arguments(self, parser):
        parser.add_argument('snapshot_id', nargs='+', type=int)

    def handle(self, *args, **options):
        snapshot_id = options['snapshot_id'][0]

        try:
            snapshot = Snapshot.objects.get(pk=snapshot_id)
        except:
            raise CommandError('Snapshot "%s" does not exist' % snapshot_id)

        snapshot.title = get_youtube_title(snapshot.source_code)
        snapshot.save()

        self.stdout.write(
            self.style.SUCCESS(
                'Successfully modified snapshot "%s"' % snapshot_id))
