from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from snapshots.parser import get_youtube_title


class Command(BaseCommand):
    help = 'Parse source code for all titles'

    def handle(self, *args, **options):
        snapshots = Snapshot.objects.all()

        for snapshot in snapshots:
            snapshot.title = get_youtube_title(snapshot.source_code)
            snapshot.save()

            self.stdout.write(
                self.style.SUCCESS(
                    'Successfully modified snapshots "%s"' % snapshot.id))

        self.stdout.write(
            self.style.SUCCESS(
                'Done modifying snapshots'
            )
        )
