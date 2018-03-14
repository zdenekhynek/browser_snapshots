from django.contrib import admin
from django.utils.safestring import mark_safe

from analysis.models import Sentiment
from analysis.watson_tone_analyzer import parse_raw_tone

class SentimentAdmin(admin.ModelAdmin):
    def parsed_tag(self, obj):
        parsed_json = parse_raw_tone(obj.watson_raw_tone)
        tones = parsed_json['document_tone']['tones']
        lis = ['<li>%s: %s</li>' % (tone['tone_name'], tone['score'])
          for tone in tones]
        lis_string = ''.join(lis)

        return mark_safe('<ul style="margin-left:10px;">%s</ul>' % lis_string)

    parsed_tag.short_description = 'Watson tone'

    fields = ('title', 'sentiment', 'parsed_tag')
    readonly_fields = ('parsed_tag',)

admin.site.register(Sentiment, SentimentAdmin)
