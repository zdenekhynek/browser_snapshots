import json

from django.core.management.base import BaseCommand, CommandError

from races.models import RaceTask
from snapshots.models import Snapshot
from youtube.models import Video
from youtube.get_yt_meta import get_yt_meta, amend_video
from youtube.get_id_from_url import get_id_from_url
from utils.command_utils import get_snapshots, add_arguments


class Command(BaseCommand):
    help = 'Get video meta from Youtube Data API'

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
                'Getting metadata for limit %s and offset %s and override %s'
                % (limit, offset, override)
            )
        )
        snapshots = get_snapshots(pk, race_id, limit, offset)

        print(snapshots.count())

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            url = snapshot.url
            video, created = Video.objects.get_or_create(url=snapshot.url)

            if created or override:
                url = snapshot.url
                yt_id = get_id_from_url(url)
                meta = get_yt_meta(yt_id)

                amend_video(yt_id, url, video, meta)

                self.stdout.write(
                    self.style.SUCCESS(
                        'Saving video meta: %s - %s' % (yt_id, video.title)
                    )
                )
            else:
                self.stdout.write(
                    self.style.SUCCESS(
                        'Skipping video as it is already processed: %s' %
                        (video.title)
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                'Done fetching video info'
            )
        )
