import json

from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from agents.models import Agent
from agents.serializers import AgentSerializer

def index(request):
    user = User.objects.get(pk=1)
    token, _ = Token.objects.get_or_create(user=user)
    agents = [AgentSerializer(agent).data for agent in Agent.objects.all()]

    context = { 'token': token, 'agents': json.dumps(agents) }
    return render(request, 'viz/index.html', context)
