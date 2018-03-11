from django.core.management import BaseCommand

from snapshots.models import Snapshot
from youtube.parser import parse_snapshot


class Command(BaseCommand):
    help = "Parse snapshots"

    def add_arguments(self, parser):
        parser.add_argument('--limit', default=-1, dest='limit', type=int)

    def handle(self, *args, **options):
        snapshots = Snapshot.objects.all()

        limit = options['limit']
        if (limit > -1):
            snapshots = snapshots[:limit]

        for snapshot in snapshots:
            parse_snapshot(snapshot)
