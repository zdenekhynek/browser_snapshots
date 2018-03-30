from django.core.management.base import BaseCommand, CommandError

from agents.models import Agent
from scenarios.models import Scenario, ScenarioType, ScenarioConfig
from tasks.models import Task, TaskStatus, TaskType


class Command(BaseCommand):
    help = 'Create task and scenario'

    def add_arguments(self, parser):
        parser.add_argument('keyword', type=str)

        parser.add_argument(
            '--type',
            dest='type',
            default=1,
            help='Is this "race" or "training"'
        )

        parser.add_argument(
            '--agent',
            dest='agent',
            default=1,
            help='Which agent'
        )

    def handle(self, *args, **options):
        # get type by id
        type_id = options['type']
        try:
            type = TaskType.objects.get(pk=type_id)
        except:
            raise CommandError('Type with id "%s" does not exist' % type_id)

        # get agent by id
        agent_id = options['agent']
        try:
            agent = Agent.objects.get(pk=agent_id)
        except:
            raise CommandError('Agent with id "%s" does not exist' % agent_id)

        # new task is always created with status queued
        status = TaskStatus.objects.get(pk=1)

        # create new scenario (of type youtube search)
        youtube_search = ScenarioType.objects.get(pk=1)
        scenario = Scenario.objects.create(type=youtube_search)
        scenario_config = ScenarioConfig.objects.create(
                                                       scenario=scenario,
                                                       key='keyword',
                                                       value=options['keyword'])

        Task.objects.create(type=type,
                            status=status,
                            agent=agent,
                            scenario=scenario)

        self.stdout.write(
            self.style.SUCCESS(
                'Successfully create task'
            )
        )
