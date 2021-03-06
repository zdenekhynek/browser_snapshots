from cProfile import Profile
from optparse import make_option
from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.sentiment import SentimentClassifier


class Command(BaseCommand):
    help = 'Do sentiment analysis on titles'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int)
        parser.add_argument('--offset', type=int)
        parser.add_argument('--profile', type=bool)


    def get_snapshots(self, limit=False, offset=False):
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
        if options['profile']:
            profiler = Profile()
            profiler.runcall(self._handle, *args, **options)
            profiler.print_stats()
        else:
            self._handle(*args, **options)

    def _handle(self, *args, **options):
        limit = options['limit']
        offset = options['offset']

        snapshots = self.get_snapshots(limit, offset)

        self.stdout.write(
            self.style.SUCCESS('Start training classifier')
        )
        sentiment_classifier = SentimentClassifier()
        sentiment_classifier.train()

        self.stdout.write(
            self.style.SUCCESS('Stop training classifier')
        )

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, _ = Sentiment.objects.get_or_create(snapshot=snapshot)
            s.sentiment = sentiment_classifier.classify([title])[0]
            s.title = title
            s.save()

            self.stdout.write(
                self.style.SUCCESS(
                    'Saving snapshot sentiment: %s - %s' % (title, s.sentiment)
                )
            )


        self.stdout.write(
            self.style.SUCCESS(
                'Done sentiment analysis'
            )
        )
