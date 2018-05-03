import json

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from agents.models import Agent
from agents.serializers import AgentSerializer
from snapshots.models import Snapshot


def getIdFromUrl(url):
  video_list = url.split('v=')

  if len(video_list) > 1 :
    video_id = url.split('v=')[1]

    try:
      ampersand_position = video_id.index('&')
      video_id = video_id[0:ampersand_position]
    except ValueError as exc:
      pass

    return video_id

  return ''


def getYoutubeThumbnail(id):
    return 'https://img.youtube.com/vi/%s/0.jpg' % (id)


def index(request):
    user = User.objects.get(pk=1)
    token, _ = Token.objects.get_or_create(user=user)
    agents = [AgentSerializer(agent).data for agent in Agent.objects.all()]

    context = { 'token': token, 'agents': json.dumps(agents) }
    return render(request, 'viz/index.html', context)


def images(request, agent_id = 0):
    snapshots = Snapshot.objects.filter(agent=agent_id).values_list('url')
    ids = [getIdFromUrl(s[0]) for s in snapshots]
    imgs = [getYoutubeThumbnail(id) for id in ids]
    context = { 'snapshots': imgs }
    return render(request, 'viz/images.html', context)

