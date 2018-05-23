from django.core.management import BaseCommand

from snapshots.models import Snapshot
from youtube.parser import parse_snapshot
from utils.command_utils import get_snapshots, add_arguments


class Command(BaseCommand):
    help = "Parse snapshots"

    def add_arguments(self, parser):
        add_arguments(parser)

    def handle(self, *args, **options):
        pk = options['pk']
        race_id = options['race_id']
        limit = options['limit']
        offset = options['offset']
        override = options['override']

        snapshots = get_snapshots(pk, race_id, limit, offset)

        for snapshot in snapshots:
            parse_snapshot(snapshot)
