from django.core.management import call_command

from rest_framework import serializers

from .models import Race, RaceAgent, RaceTask
from agents.models import Agent
from tasks.models import Task

class RaceSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Race
        fields = ('id', 'keyword',)

    def create(self, validated_data):
        keyword = validated_data['keyword']
        agents = validated_data['agents']

        # TODO - should be the object creation be done
        # within

        # remove key which belongs to relate model
        # validated_data.pop('keyword')
        validated_data.pop('agents')

        race = Race.objects.create(**validated_data)

        # create related models for each agent
        for agent_id in agents:
          # create related agents
          try:
            agent = Agent.objects.get(pk=agent_id)
          except:
            raise CommandError('Agent with id "%s" does not exist' % agent_id)

          RaceAgent.objects.create(race=race, agent=agent)

          # create related task with a custom command
          task_id = call_command('create_search_task', keyword, no_out=True,
            agent=agent_id)

          # store
          task = Task.objects.get(pk=task_id)
          RaceTask.objects.create(race=race, task=task)

        return race
