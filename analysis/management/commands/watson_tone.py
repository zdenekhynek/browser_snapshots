import json

from django.core.management.base import BaseCommand, CommandError

from snapshots.models import Snapshot
from analysis.models import Sentiment
from analysis.sentiment import SentimentClassifier
from analysis.watson_tone_analyzer import WatsonToneAnalyzer


class Command(BaseCommand):
    help = 'Do watson tone analysis on titles'


    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int)
        parser.add_argument('--offset', type=int)
        parser.add_argument('--override', type=bool)


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
        limit = options['limit']
        offset = options['offset']
        override = options['override']

        self.stdout.write(
            self.style.SUCCESS(
                'Classifying tone for limit %s and offset %s and override %s'
                % (limit, offset, override)
            )
        )

        self.stdout.write(
            self.style.SUCCESS('Start training classifier')
        )
        sentiment_classifier = SentimentClassifier()
        sentiment_classifier.train()

        self.stdout.write(
            self.style.SUCCESS('Stop training classifier')
        )

        watson_tone_analyzer = WatsonToneAnalyzer()

        snapshots = self.get_snapshots(limit, offset)

        # use iterator to avoid huge memory consumption on heroku
        for snapshot in snapshots.iterator():
            title = snapshot.title
            s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

            if created or override:
                s.sentiment = sentiment_classifier.classify([title])[0]
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
