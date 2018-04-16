import random
from datetime import datetime, timezone

from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command

from races.models import Race, RaceAgent, RaceTask
from trainings.models import Training
from tasks.models import Task, TaskType


# class Command(BaseCommand):
#     help = 'Create race'

#     def add_arguments(self, parser):
#         parser.add_argument('keyword', type=str)

#         parser.add_argument(
#             '--agent',
#             dest='agent',
#             action='append',
#             default=[],
#             help='Which agent is racing?'
#         )


#     def handle(self, *args, **options):
#         # do we have agents keyword for the race
#         agents = options['agent']
#         keyword = options['keyword']
#         if len(agents) > 0:

#             # 1. create race task
#             race = Race.objects.create(keyword=keyword)

#             # 2. create race tasks for each racer
#             for agent_id in agents:
#                 agent_id = options['agent']
#                 try:
#                     agent = Agent.objects.get(pk=agent_id)
#                 except:
#                     raise CommandError('Agent with id "%s" does not exist' % agent_id)

#                 # tie racer to the race
#                 RaceAgent.objects.create(agent=agent, race=race)

#                 # create task
#                 call_command('create_search_task', keyword, no_out=False,
#                              type=1, agent=agent.id)

#                 # 3. link task to the race
#                 RaceTask.objects.create(agent=agent)

#         else:
#             self.stdout.write(
#                self.style.ERROR('Missing agents for race')
#             )

        # get all
        # trainings = Training.objects.all()

        # for training in trainings:
        #     # get last training task for agent of the given training
        #     training_type = TaskType.objects.get(pk=2)

        #     create_task = False

        #     try:
        #         # check the date of the last task
        #         tasks = Task.objects.filter(agent=training.agent,
        #                                     type=training_type,
        #                                     status=1)
        #         task = tasks.latest('created_at')

        #         # calculate the time diff
        #         time_diff = datetime.now(timezone.utc) - task.created_at
        #         diff_seconds = time_diff.total_seconds()

        #         if diff_seconds > training.interval:
        #             # time to create a new task
        #             create_task = True

        #     except Task.DoesNotExist:
        #         create_task = True

        #     if create_task:
        #         keyword = select_random_keyword(training.keywords.all())
        #         call_command('create_search_task', keyword, no_out=False,
        #                      type=2, agent=training.agent.id)
        #         self.stdout.write(
        #             self.style.SUCCESS(
        #                 'Created a training task for %s' % (training.agent)
        #             )
        #         )
        #     else:
        #         self.stdout.write(
        #             self.style.SUCCESS(
        #                 'No training task needed for %s' % (training.agent)
        #             )
        #         )
