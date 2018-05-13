from django.contrib import admin

from tasks.models import Task

class TaskAdmin(admin.ModelAdmin):
    fields = ('type', 'status', 'agent', 'session', 'scenario',
              'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    list_filter = ('agent', 'status')

admin.site.register(Task, TaskAdmin)
