from __future__ import print_function
import json
from os.path import join, dirname

from django.conf import settings
from watson_developer_cloud import ToneAnalyzerV3


def parse_raw_tone(raw_tone_json):
        return json.loads(raw_tone_json)


class WatsonToneAnalyzer():
    def __init__(self):
        username = settings.WATSON_USERNAME
        password = settings.WATSON_PASSWORD

        self.tone_analyzer = ToneAnalyzerV3(
            username=username,
            password=password,
            version='2017-09-26'
        )


    def tone(self, tone_input):
        return self.tone_analyzer.tone(tone_input=tone_input,
                                       content_type='text/plain')


