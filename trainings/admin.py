from django.contrib import admin

from trainings.models import Training, TrainingKeyword

class KeywordInline(admin.TabularInline):
    model = TrainingKeyword


class TrainingAdmin(admin.ModelAdmin):
    inlines = [
        KeywordInline,
    ]

admin.site.register(Training, TrainingAdmin)
