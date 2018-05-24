import requests

from django.conf import settings
from youtube.get_id_from_url import get_id_from_url
from youtube.models import VideoCategory


def get_yt_data_api_url(id):
  endpoint = 'https://www.googleapis.com/youtube/v3/commentThreads'
  video_id = 'videoId=%s' % (id)
  key = 'key=%s' % (settings.GOOGLE_API_KEY)
  part = 'part=snippet,replies'
  return '%s?%s&%s&%s' % (endpoint, video_id, key, part)


def fetch_comments(id):
  api_url = get_yt_data_api_url(id)
  r = requests.get(api_url)

  comments = {}

  if r.status_code == 200:
    comments = r.json()

  return comments


def get_yt_comments(id):
  comments = fetch_comments(id)
  return comments


def amend_comment(video, text):
  comment, _ = VideoComment.objects.get_or_create(video=video, text=text)
  comment.video = video
  comment.text = text
  comment.save()

  return comment
