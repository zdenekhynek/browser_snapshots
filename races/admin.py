from django.contrib import admin

from races.models import Race, RaceAgent, RaceTask

class AgentInline(admin.TabularInline):
    model = RaceAgent

class TaskInline(admin.TabularInline):
    model = RaceTask

class RacesAdmin(admin.ModelAdmin):
    inlines = [
        AgentInline, TaskInline,
    ]

# Register your models here.
admin.site.register(Race, RacesAdmin)
