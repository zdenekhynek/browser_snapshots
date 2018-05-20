import os
import json

import requests

from django.conf import settings

API_KEY = settings.GOOGLE_API_KEY

GOOGLE_API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos'

def get_url(video_id):
  url = GOOGLE_API_ENDPOINT
  url += '?id=%s' % (video_id)
  url += '&key=%s' % (API_KEY)
  url += '&part=snippet,contentDetails,statistics,status'

  return url

def get_video_meta(video_id):
  print('get_video_meta')
  print(video_id)
  url = get_url(video_id)
  print(url)
  r = requests.get(url)
  return r.json()
