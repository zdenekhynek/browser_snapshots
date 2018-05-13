import json

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from agents.models import Agent
from agents.serializers import AgentSerializer
from snapshots.models import Session, Snapshot


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

def updateThumbWithImage(thumb):
    thumb.update({ 'img': getYoutubeThumbnail(thumb['id']) })
    return thumb

def index(request):
    user = User.objects.get(pk=1)
    token, _ = Token.objects.get_or_create(user=user)
    agents = [AgentSerializer(agent).data for agent in Agent.objects.all()]

    context = { 'token': token, 'agents': json.dumps(agents) }
    return render(request, 'viz/index.html', context)


def thumbs(request, agent_id = 0):
    snapshots = Snapshot.objects.filter(agent=agent_id).values_list('url', 'title')

    thumbs = [{ 'id': getIdFromUrl(s[0]), 'url': s[0], 'title': s[1] } for s in snapshots]

    # construct img urls, only if id actually exists
    thumbs = [updateThumbWithImage(thumb) for thumb in thumbs if thumb['id']]

    # only unique values
    thumbs = list({v['id']:v for v in thumbs}.values())

    context = { 'snapshots': thumbs }
    return render(request, 'viz/thumbs.html', context)


def images(request, agent_id = 0):
    snapshots = Snapshot.objects.filter(agent=agent_id).values_list('url', 'image')

    thumbs = [{ 'url': s[0], 'image': s[1] } for s in snapshots]

    context = { 'snapshots': thumbs }
    return render(request, 'viz/images.html', context)

def titles(request, agent_id = 0):
    snapshots = Snapshot.objects.filter(agent=agent_id).values_list('title')
    titles = {s[0] for s in snapshots}

    # only unique values
    titles_set = set(titles)

    context = { 'snapshots': titles_set }
    return render(request, 'viz/titles.html', context)

def sessions(request, agent_id = 0):
    sessions = Session.objects.filter(agent=agent_id).select_related()

    print('sessions.snapshost')
    print(sessions.snapshot)

    titles = {s[0] for s in snapshots}

    # only unique values
    titles_set = set(titles)

    context = { 'snapshots': titles_set }
    return render(request, 'viz/sessions.html', context)

