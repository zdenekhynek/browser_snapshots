from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.sentiment import SentimentClassifier


class Command(BaseCommand):
    help = 'Do sentiment analysis on titles'

    def handle(self, *args, **options):
        snapshots = Snapshot.objects.all()

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
